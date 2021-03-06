import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { loadModules } from 'esri-loader';
import esri = __esri;
@Component({
  selector: 'app-park-list',
  templateUrl: './park-list.component.html',
  styleUrls: ['./park-list.component.scss']
})
export class ParkListComponent implements OnInit, OnChanges {
  @Input('view') view:esri.MapView;
  @Input('parkLayer') parkLayer:esri.FeatureLayer;
  @Input('where') where:string;
  @Input('location') location:esri.Graphic;

  @Output() parkSelected = new EventEmitter<esri.Graphic>();
  @Output() chipClicked = new EventEmitter<esri.Field>();

  filterString:string = '';
  features:esri.Graphic[] = [];
  chipFields:esri.Field[] = [];
  constructor(private route: ActivatedRoute, private router:Router) { }
  removeChip(event, field:esri.Field) {
    this.chipFields.splice(this.chipFields.indexOf(field),1);
    this.chipClicked.emit(field);
  }
  filterParks() {
    this.chipFields = [];
    this.parkLayer.fields.forEach(field => {
      //@ts-ignore
      if (this.where.toUpperCase().includes(' '+field.name+' ')) {
        this.chipFields.push(field);
      }
    });

    
    this.parkLayer.queryFeatures({where: this.where, outFields:['*'], returnGeometry: true}).then((fs:esri.FeatureSet) => {

      loadModules(["esri/geometry/geometryEngine"]).then(([geometryEngine]) => {
        fs.features.forEach(feature => {

          feature.attributes.distance = geometryEngine.distance(feature.geometry, (this.location) ? this.location.geometry : this.view.extent.center, 'miles');
        });
        fs.features.sort((a:esri.Graphic,b:esri.Graphic) => {
          return a.attributes.distance - b.attributes.distance;
        });
        this.features = fs.features;
        document.getElementsByClassName('park-list')[0].setAttribute("style", "height:" +((document.getElementsByClassName('park-list-body')[0] as HTMLElement).offsetHeight - (document.getElementsByClassName('filter')[0] as HTMLElement).offsetHeight)+'px');

      });
   
    });



    
  }

  filterByParkName(event) {
    this.filterString = event.target.value;

    
  }

  parkClicked(event, park:esri.Graphic) {
    this.view.goTo({target: park, zoom: 16});    
    this.parkSelected.emit(park);
  }
  ngOnChanges(changes:SimpleChanges) {
    if (changes.where) {
      
      this.filterParks();
    }

  }
  ngOnInit() {
    try {
      if (this.route.routeConfig) {
      
        if(this.route.snapshot.children.length) {
    
              if (this.route.snapshot.children[0].params.park) {
                const where = "lower(NAME) = '" + this.route.snapshot.children[0].params.park.replace(/_/g,' ') + "'";
                this.parkLayer.queryFeatures({where: where, outFields:['*'], returnGeometry: true}).then((fs:esri.FeatureSet) => {
                  this.view.goTo({target: fs.features[0], zoom: 16});    
                  this.parkSelected.emit(fs.features[0]);
                });
    
              }
    
        }
      
      }     
      this.view.watch('stationary', (extent) => {
        this.filterParks();
      });
    } catch {
      console.log("Layer not found");
    }

  }

}
