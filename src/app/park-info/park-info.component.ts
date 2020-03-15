import { Component, OnInit, Input, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { loadModules } from 'esri-loader';
import { Symbols } from '../symbols';

import esri = __esri;
@Component({
  selector: 'app-park-info',
  templateUrl: './park-info.component.html',
  styleUrls: ['./park-info.component.scss']
})
export class ParkInfoComponent implements OnInit, OnChanges {
  @Input('selectedPark') selectedPark:esri.Graphic;
  activities:string[] = [];
  symbols:Symbols = new Symbols();
  locate:esri.Locate = null;
  directions:esri.Directions = null;
  showDirections:boolean = false;
  constructor() { }
  getImage() {
    return "https://maps.raleighnc.gov/parklocator/images/photos/"+ this.selectedPark.attributes.NAME.toLowerCase().replace(/\s/g,'').replace(/\./g,'').replace(/&/,'').replace(/\'/g,'').replace(/\,/g,'') +".jpg";
  }
  @ViewChild("overview", { static: true }) private overviewEl: ElementRef;
  @ViewChild("directions", { static: true }) private directionsEl: ElementRef;

  @Input('view') view:esri.MapView = null;
  overview:esri.MapView = null;
  overviewLayer:esri.FeatureLayer = null;
  async initializeMap() {
    try {
      // Load the modules for the ArcGIS API for JavaScript
      const [Directions,Graphic, WebMap, MapView, Locate, geometryEngine, OAuthInfo, esriId] = await loadModules([//WebMap, MapView, Search] = await loadModules([
        "esri/widgets/Directions",
        "esri/Graphic",
        "esri/WebMap",
        "esri/views/MapView",
        "esri/widgets/Locate",
        "esri/geometry/geometryEngine",
        "esri/identity/OAuthInfo", "esri/identity/IdentityManager"
        //"esri/widgets/Search"
      ]);
      // var info = new OAuthInfo({
      //   appId: "PAPgdOYlDXMgCJ2D",
      //   popup: false
      // });
    
      // esriId.registerOAuthInfos([info]);
      const  webmap:esri.WebMap = new WebMap({
        portalItem: { // autocasts as new PortalItem()
          id: "060d47d2c5bb49b49852d4aea35f1dbf"
        }
      });

      // Initialize the MapView
      const mapViewProperties: esri.MapViewProperties = {
        container: this.overviewEl.nativeElement,
        map: webmap
      };
      
      const view:esri.MapView = new MapView(mapViewProperties);
      this.locate = new Locate({view: view});
      this.locate.goToOverride = (view) => {
        this.overview.graphics.add(this.locate.graphic);
        const extent:esri.Extent = geometryEngine.buffer(this.locate.graphic.geometry, 1, 'feet').extent;
        const extent2:esri.Extent = geometryEngine.buffer(this.selectedPark.geometry, 1, 'feet').extent;

        this.overview.goTo(extent.union(extent2));
      };
      view.when(() => {
        
        this.overview = view;
        
        const matches = this.overview.map.layers.filter(layer => {
          if (layer.title) {
            return layer.title.includes('Raleigh Parks');
          } else {
            return false;
          }

        });
        
        this.overviewLayer = matches.getItemAt(0) as esri.FeatureLayer;
        this.overview.whenLayerView(this.overviewLayer).then(() => {
          
          if (this.selectedPark) {
            this.locate.locate();
            this.overviewLayer.definitionExpression = "NAME = '"+this.selectedPark.attributes.NAME+"'";

          }
        })
        
      });
      
        this.directions  = new Directions({
          view: view,
          container: this.directionsEl.nativeElement,
          routeServiceUrl: 'https://utility.arcgis.com/usrsvcs/servers/4c9b6a145dce48b28a27ff4c5523c42f/rest/services/World/Route/NAServer/Route_World'

        });
        if (this.selectedPark) {


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

  getDirections() {
    
    this.showDirections = true;
    this.locate.locate().then();
    this.directions.viewModel.stops.removeAll();
    this.directions.viewModel.stops.addMany([this.selectedPark, this.locate.graphic]);

    this.directions.getDirections();
  }
  ngOnInit() {
   this.initializeMap();
  }

  ngOnChanges(change:SimpleChanges) {
    if (change.selectedPark) {
      this.activities = [];
      this.showDirections = false;
      for (let key in this.selectedPark.attributes) {
        if (this.selectedPark.attributes[key] === 'Yes') {
          this.activities.push(this.symbols.symbols.filter(symbol => {
            return symbol.name === key;
          })[0]);

          if (this.overview && this.overviewLayer) {
            this.overviewLayer.definitionExpression = "NAME = '"+this.selectedPark.attributes.NAME+"'";
            this.locate.locate();

          }


        }
      }
      
    }
  }

}
