import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GoogleMapsService } from './googlemaps.service';
import { Marker } from './models/marker';
import { google } from 'googlemaps';


@Component({
  selector: 'app-googlemap',
  templateUrl: './googlemap.component.html',
  styleUrls: ['./googlemap.component.scss']
})
export class GoogleMapsComponent implements OnInit {

    ngOnInit(): void {
    }

    @ViewChild('map') mapElement: ElementRef;
    map: google.maps.Map;

  constructor(private googleMapsService: GoogleMapsService) { }

/**
     * Load google maps
     */
    loadMap() {

        let latLng = new google.maps.LatLng(-34.9290, 138.6010);

        let mapOptions: google.maps.MapOptions = {
            center: latLng,
            zoom: 20,
            mapTypeId: google.maps.MapTypeId.SATELLITE,
            rotateControl: true,
            tilt: 45,
            panControl: true,
            disableDefaultUI: true,
            rotateControlOptions: {
                position: google.maps.ControlPosition.RIGHT_CENTER
            },
        }

        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        var overlay = new google.maps.OverlayView()
        overlay.draw = function () {
            this.getPanes().markerLayer.id = 'markerLayer'
        }
        overlay.setMap(this.map);

        google.maps.event.addListener(this.map, "click", (event) => {
            //add event to each marker we add
            //whenever we click a marker zoom in on the map
            //and show windrose
            //and show popup
            /*this._markers.push(new Marker({
                position: event.latLng,
                map: this.map,
                draggable: true,
                clickable: true,
            }));*/
            new Marker(this.googleMapsService, {
                position: event.latLng,
                map: this.map,
                draggable: true,
                clickable: true,
                icon: {
                    url: 'assets/img/target_sami_medium.png',
                    origin: new google.maps.Point(0, 0),
                    scaledSize: new google.maps.Size(250, 250)
                },
            });
            this.map.panTo(this.googleMapsService.getLast().getPosition());
            this.map.setZoom(20);
        });
    }

    public rotateMarker(clockwise: boolean): void {
        this.googleMapsService.rotateMarker(clockwise);
    }

    public deleteMarker() {
        this.googleMapsService.deleteMarker();
    }

    public get selectedMarker(): number {
        return this.googleMapsService.selectedMarker;
    }

    public saveMarker() {
        new Marker(this.googleMapsService, {
            position: this.googleMapsService.getMarkerInCreationState.getPosition(),
            map: this.map,
            clickable: true,
        })
        this.googleMapsService.saveMarker();
    }

    public markerInCreationState(): Marker {
        return this.googleMapsService.getMarkerInCreationState;
    }
}