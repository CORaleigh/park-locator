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
  @Output() parkSelected = new EventEmitter<esri.Graphic>();
  @Output() chipClicked = new EventEmitter<esri.Field>();

  filterString:string = '';
  features:esri.Graphic[] = [];
  chipFields:esri.Field[] = [];
  constructor(private route: ActivatedRoute, private router:Router) { }
  removeChip(event, field:esri.Field) {
    //@ts-ignore
    field.checked = false;
    this.chipFields.splice(this.chipFields.indexOf(field),1);
    let matches = this.parkLayer.fields.filter(f => {
      return f.name === field.name;
    });
    if (matches.length) {
      //@ts-ignore
      matches[0].checked = false;
    }
    this.chipClicked.emit(field);
  }
  filterParks() {
    this.chipFields = [];
    this.parkLayer.fields.forEach(field => {
      //@ts-ignore
      if (this.where.includes(field.name)) {
        this.chipFields.push(field);
      }
    });

    // this.chipFields = this.parkLayer.fields.filter((field) => {
    //   return this.where.includes(' ' + field.name + ' ');
    // });
    
    this.parkLayer.queryFeatures({where: this.where, outFields:['*'], returnGeometry: true}).then((fs:esri.FeatureSet) => {

      loadModules(["esri/geometry/geometryEngine"]).then(([geometryEngine]) => {
        fs.features.forEach(feature => {

          feature.attributes.distance = geometryEngine.distance(feature.geometry, this.view.extent.center, 'miles');
        });
        fs.features.sort((a:esri.Graphic,b:esri.Graphic) => {
          return a.attributes.distance - b.attributes.distance;
        });
        this.features = fs.features;
   
      });
      setTimeout(() => {
        document.getElementsByClassName('park-list')[0].setAttribute("style", "height:" +((document.getElementsByClassName('park-list-body')[0] as HTMLElement).offsetHeight - (document.getElementsByClassName('filter')[0] as HTMLElement).offsetHeight)+'px');

       })     
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

      this.view.watch('stationary', (extent) => {
        this.filterParks();
      });
    } catch {
      console.log("Layer not found");
    }

  }

}
