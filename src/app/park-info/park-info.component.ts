import { Component, OnInit, Input, ElementRef, ViewChild } from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri;
@Component({
  selector: 'app-park-info',
  templateUrl: './park-info.component.html',
  styleUrls: ['./park-info.component.scss']
})
export class ParkInfoComponent implements OnInit {
  @Input('selectedPark') selectedPark:esri.Graphic;
  constructor() { }
  getImage() {
    return "https://maps.raleighnc.gov/parklocator/images/photos/"+ this.selectedPark.attributes.NAME.toLowerCase().replace(/\s/g,'').replace(/\./g,'') +".jpg";
  }
  @ViewChild("directions", { static: true }) private directionsEl: ElementRef;
  @Input('view') view:esri.MapView = null;
  
  async initializeMap() {
    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [Directions,Graphic, WebMap, MapView] = await loadModules([//WebMap, MapView, Search] = await loadModules([
        "esri/widgets/Directions",
        "esri/Graphic",
        "esri/WebMap",
        "esri/views/MapView"
        //"esri/widgets/Search"
      ]);

      const  webmap:esri.WebMap = new WebMap({
        portalItem: { // autocasts as new PortalItem()
          id: "060d47d2c5bb49b49852d4aea35f1dbf"
        }
      });

      // Initialize the MapView
      const mapViewProperties: esri.MapViewProperties = {
        container: this.directionsEl.nativeElement,
        map: webmap
      };
      
      const view:esri.MapView = new MapView(mapViewProperties);
        const directions:esri.Directions = new Directions({
          view: view

        });
        view.ui.add(directions, 'top-right');
        if (this.selectedPark) {
          directions.viewModel.stops.push(this.selectedPark);

          directions.viewModel.stops.push(new Graphic({attributes:{}, geometry: this.view.extent.center}));
          

        }
      // const  webmap:esri.WebMap = new WebMap({
      //   portalItem: { // autocasts as new PortalItem()
      //     id: "060d47d2c5bb49b49852d4aea35f1dbf"
      //   }
      // });

      // // Initialize the MapView
      // const mapViewProperties: esri.MapViewProperties = {
      //   container: this.mapViewEl.nativeElement,
      //   map: webmap
      // };
      
      // const view:esri.MapView = new MapView(mapViewProperties);
      // const search:esri.widgetsSearch = new Search({view:view});
      // view.ui.move('zoom', 'bottom-left')
      // view.ui.add(search, 'top-left');

      // await view.when();
      // return view;
    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }
  ngOnInit() {
   // this.initializeMap();
  }

}
