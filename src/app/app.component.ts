import { Component, ViewChild } from '@angular/core';
import { circle, Icon, icon, latLng, marker, polygon, tileLayer } from "leaflet";
import { $e } from "@angular/compiler/src/chars";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ngx-leaflet-playground';
  showLayer = false;

  options = {
    // attributionControl: false,
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; Playground for U-Sky'
      })
    ],
    zoom: 8,
    center: latLng(46.879966, -121.726909)
    // center: latLng([ 40.17887331434698, -4.394529908895493]) // Spain
  };


  layers = [
    circle([46.95, -122], { radius: 5000 }),
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

  otherLayers = [circle([47.45, -122], { radius: 5000 }),
    marker([46.879966, -120.726909], {
      icon: icon({
        ...Icon.Default.prototype.options,
        iconUrl: 'assets/marker-icon.png',
        iconRetinaUrl: 'assets/marker-icon-2x.png',
        shadowUrl: 'assets/marker-shadow.png'
      })
    })
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
      'Big Circle': circle([46.95, -122], { radius: 5000 }),
      'Big Square': polygon([[46.8, -121.55], [46.9, -121.55], [46.9, -121.7], [46.8, -121.7]])
    }
  }

  // @ViewChild('leaflet') leafletMap: Leaflet

  manageLeafletCenterChange($event: any) {
    console.log($event);
  }
}
