import {Component, ViewChild} from '@angular/core';
import {
  circle,
  Icon,
  icon,
  LatLng,
  latLng,
  LatLngLiteral,
  LeafletMouseEvent,
  marker,
  polygon,
  polyline,
  tileLayer
} from "leaflet";

import * as L from 'leaflet';

import 'leaflet-rotatedmarker';

export const markerBasicOptions = {
  icon: icon({
    ...Icon.Default.prototype.options,
    iconUrl: 'assets/marker-icon.png',
    iconRetinaUrl: 'assets/marker-icon-2x.png',
    shadowUrl: 'assets/marker-shadow.png'
  }),
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngx-leaflet-playground';
  showLayer = false;
  showPlanes = false;

  interestingPoints = {
    spainCenter: {
      latLng: {lat: 40.3130432088809, lng: -3.128906786441803},
      coords: [40.3130432088809, -3.128906786441803]
    },
    Madrid: {
      latLng: {lat: 40.34654412118006, lng: -3.6826171539723878},
      coords: [40.34654412118006, -3.6826171539723878]
    },
    Toledo: {
      latLng: {
        lat: 39.738451927387004,
        lng: -4.016601629555226
      },
      coords: [39.738451927387004, -4.016601629555226]
    },
    Caceres: {
      latLng: {lat: 39.36573106756214, lng: -6.389648504555225},
      coords: [39.36573106756214, -6.389648504555225]
    }
  };

  zoom: number = 6;
  center: LatLng = latLng(this.interestingPoints.spainCenter.latLng);

  options = {
    // attributionControl: false,
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; Playground for U-Sky'
      })
    ],
    // zoom: 6,
    // zoom: 8,
    // center: latLng(46.879966, -121.726909)
    // center: latLng([40.17887331434698, -4.394529908895493]) // Spain
    // center: this.center
  };


  firstPolyLine = polyline([this.interestingPoints.Madrid.latLng, this.interestingPoints.Toledo.latLng]);

  secondPolyLine = polyline([
    this.interestingPoints.Toledo.latLng,
    this.interestingPoints.Caceres.latLng]);

  layers = [marker(this.interestingPoints.Madrid.latLng, markerBasicOptions),
    marker(this.interestingPoints.Toledo.latLng, markerBasicOptions),
    marker(this.interestingPoints.Caceres.latLng, markerBasicOptions),
    this.firstPolyLine,
    this.secondPolyLine
  ];


  returnPolyline = polyline([this.interestingPoints.Caceres.latLng, this.interestingPoints.Madrid.latLng]);

  // planeOne: {latLng: this.firstPolyLine.getCenter()}
  airplanes = {
    planeOne: {
      latLng: {
        lat: this.interestingPoints.Madrid.latLng.lat - (this.interestingPoints.Madrid.latLng.lat - this.interestingPoints.Toledo.latLng.lat) / 2,
        lng: this.interestingPoints.Madrid.latLng.lng - (this.interestingPoints.Madrid.latLng.lng - this.interestingPoints.Toledo.latLng.lng) / 2
      },
      origin: this.interestingPoints.Madrid.latLng,
      dest: this.interestingPoints.Toledo.latLng
    },
    planeTwo: {
      latLng: {
        lat: this.interestingPoints.Caceres.latLng.lat - (this.interestingPoints.Caceres.latLng.lat - this.interestingPoints.Madrid.latLng.lat) / 2,
        lng: this.interestingPoints.Caceres.latLng.lng - (this.interestingPoints.Caceres.latLng.lng - this.interestingPoints.Madrid.latLng.lng) / 2
      },
      origin: this.interestingPoints.Caceres.latLng,
      dest: this.interestingPoints.Madrid.latLng
    }
  };

  otherLayers = [
    this.returnPolyline,
    // marker(this.airplanes.planeOne.latLng, markerBasicOptions),
    // marker(this.airplanes.planeTwo.latLng, markerBasicOptions),
  ];

  planesLayer = [
    L.marker(this.airplanes.planeOne.latLng,
      {
        icon: icon({
          ...Icon.Default.prototype.options,
          iconUrl: 'assets/icons/airplane.svg',
          iconRetinaUrl: 'assets/icons/airplane.svg',
          shadowUrl: '',
          iconAnchor: [12, 24], // [half of icons size, icon size],
          iconSize: [24, 24]
        }),
        rotationAngle: this.calculateAirplaneRotationDegree(this.airplanes.planeOne.origin, this.airplanes.planeOne.dest),
        rotationOrigin: 'center center'
      }),
    L.marker(this.airplanes.planeTwo.latLng,
      {
        icon: icon({
          ...Icon.Default.prototype.options,
          iconUrl: 'assets/icons/airplane.svg',
          iconRetinaUrl: 'assets/icons/airplane.svg',
          shadowUrl: '',
          iconAnchor: [12, 24],
          iconSize: [24, 24]
        }),
        rotationAngle: this.calculateAirplaneRotationDegree(this.airplanes.planeTwo.origin, this.airplanes.planeTwo.dest),
        rotationOrigin: 'center center'
      }),
  ];

  oldLayers = [
    circle([46.95, -122], {radius: 5000}),
    polygon([[46.8, -121.85], [46.92, -121.92], [46.87, -121.8]]),
    marker([46.879966, -121.726909], {
      icon: icon({
        ...Icon.Default.prototype.options,
        iconUrl: 'assets/marker-icon.png',
        iconRetinaUrl: 'assets/marker-icon-2x.png',
        shadowUrl: 'assets/marker-shadow.png'
      })
    })
  ];

  oldOtherLayers = [
    circle([47.45, -122], {radius: 5000}),
    marker([46.879966, -120.726909], {
      icon: icon({
        ...Icon.Default.prototype.options,
        iconUrl: 'assets/marker-icon.png',
        iconRetinaUrl: 'assets/marker-icon-2x.png',
        shadowUrl: 'assets/marker-shadow.png'
      })
    }),
    polyline([[46.95, -122], [47.25, -121.8], [47.45, -122]
    ]),
  ];

  layersControl = {
    baseLayers: {
      'Open Street Map': tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...'
      }),
      'Open Cycle Map': tileLayer('http://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '...'
      })
    },
    overlays: {
      'Big Circle': circle([46.95, -122], {radius: 5000}),
      'Big Square': polygon([[46.8, -121.55], [46.9, -121.55], [46.9, -121.7], [46.8, -121.7]])
    }
  }

  manageLeafletCenterChange($event: any) {
    console.log($event);
  }

  onLeafletClick($event: LeafletMouseEvent) {
    console.log('onLeafletClick');
    console.log($event);

    console.log('CALCULO ANGULO');
    this.calculateAirplaneRotationDegree(this.interestingPoints.Madrid.latLng, this.interestingPoints.Toledo.latLng);
  }

  onLeafletDoubleClick($event: LeafletMouseEvent) {
    console.log('onLeafletDoubleClick');
    console.log($event);
  }

  calculateAirplaneRotationDegree(orig: LatLngLiteral, dest: LatLngLiteral): number {
    const y = orig.lat - dest.lat;
    const x = orig.lng - dest.lng;
    const beta = 270 - Math.atan((orig.lat - dest.lat) / (orig.lng - dest.lng)) * 180 / Math.PI;
    console.log('angulo: ', beta, x, y, orig, dest);
    return beta;
  }

  changeShowPlanes() {
    console.log(`center: ${this.center}`);
    console.log(`zoom: ${this.zoom}`);
    if (this.zoom > 4) {
      this.showPlanes = !this.showPlanes;
    } else {
      this.showPlanes = false;
    }
  }

  onLeafletZoomChange($event: number) {
    // $event es igual a this.zoom
    this.showPlanes = this.zoom > 4;
    console.log('cambio zoom');
    console.log($event);
    console.log(this.zoom);
  }
}
