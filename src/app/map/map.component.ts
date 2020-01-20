import { Component, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  @ViewChild("mapViewNode", { static: true }) private mapViewEl: ElementRef;
  @Output() viewLoaded = new EventEmitter<esri.MapView>();
  @Output() parkLayerLoaded = new EventEmitter<esri.FeatureLayer>();
  @Output() locationSet = new EventEmitter<esri.Graphic>();

  view:esri.MapView;
  constructor() { }
  async initializeMap() {
    try {
      if (!this.view) {
      // Load the modules for the ArcGIS API for JavaScript
      const [WebMap, MapView, Search, Graphic, Point] = await loadModules([
        "esri/WebMap",
        "esri/views/MapView",
        "esri/widgets/Search",
        "esri/Graphic",
        "esri/geometry/Point"
      ]);

      const  webmap:esri.WebMap = new WebMap({
        portalItem: { // autocasts as new PortalItem()
          id: "060d47d2c5bb49b49852d4aea35f1dbf"
        }
      });

      // Initialize the MapView
      const mapViewProperties: esri.MapViewProperties = {
        container: this.mapViewEl.nativeElement,
        map: webmap
      };
      
      const view:esri.MapView = new MapView(mapViewProperties);
      this.view = view;
      const search:esri.widgetsSearch = new Search({view:view});
      search.on('select-result', event => {
        view.graphics.removeAll();
        this.locationSet.emit(event.result.feature);
      });
      search.on('search-clear', event => {
        this.locationSet.emit(null);
      });
      view.ui.move('zoom', 'bottom-left')
      view.ui.add(search, 'top-left');

      await view.when().then(() => {
        // if (navigator.geolocation) {
        //   navigator.geolocation.getCurrentPosition((position)=> {
            
        //     const graphic:esri.Graphic = new Graphic();
        //     graphic.attributes = {};
        //     graphic.geometry = new Point({x: position.coords.longitude, y:position.coords.latitude, spatialReference: {wkid: 4326}});
        //     view.graphics.add(graphic);
        //     view.goTo({target:graphic, zoom: 14});
        //     this.locationSet.emit(graphic);
        //   });
        // }
      });
      return view;
      }

    } catch (error) {
      console.log("EsriLoader: ", error);
    }
  }

  ngOnInit() {
    this.initializeMap().then(view => {
      this.viewLoaded.emit(view);

      const parkLayer:esri.FeatureLayer = view.map.layers.filter((layer:esri.Layer) => {
        return layer.title.includes('Raleigh Parks');
      }).getItemAt(0) as esri.FeatureLayer;
      
      view.whenLayerView(parkLayer).then((layerView:esri.LayerView) => {
        this.parkLayerLoaded.emit(parkLayer);

      });      
    });
  }

}
