import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri;
import { ActivatedRoute, Router } from '@angular/router';
import { Symbols } from '../symbols'
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
@Component({
  selector: 'app-amenity-filter',
  templateUrl: './amenity-filter.component.html',
  styleUrls: ['./amenity-filter.component.scss']
})
export class AmenityFilterComponent implements OnInit, OnChanges {
  @Input('view') view:esri.MapView;
  @Input('parkLayer') parkLayer:esri.FeatureLayer;
  @Input('toggleField') toggleField:esri.Field;

  @Output() parksFiltered = new EventEmitter<string>();
  fields:esri.Field[] = [];
  selected:string[] = []
  symbols:Symbols = new Symbols();
  constructor(private route: ActivatedRoute, private router:Router) { }

  toggle(event:MatSlideToggleChange, field:esri.Field) {
    
    if (event.checked && !this.selected.includes(field.name)) {

      this.selected.push(field.name);
    } else {
      this.selected.splice(this.selected.indexOf(field.name),1);
    }
    let where:string = "1=1";
    if (this.selected.length) {
      if (this.selected.length === 1) {
        where = this.selected[0] + " = 'Yes'";
      } else {
        where = this.selected.toString().replace(/,/g, " = 'Yes' OR ")+ " = 'Yes'";
      }
    } 
    
    this.parkLayer.definitionExpression = where;
    this.parkLayer.queryFeatures({where: where, returnGeometry: true}).then((fs:esri.FeatureSet) => {
      this.view.goTo(fs.features);
    });
    this.parksFiltered.emit(where);
    this.router.navigate(['activities', this.selected.toString().replace(/,/g, '-')]);
    //@ts-ignore
    field.checked = !field.checked;
  }
  ngOnChanges(change:SimpleChanges) {
    if (change.toggleField.currentValue) {
      

      let event:MatSlideToggleChange = new MatSlideToggleChange(null, false);


      this.toggle(event,this.toggleField );

    }
  } 


 
  ngOnInit() {
    try {
        let fields:any[] = this.parkLayer.fields.filter((field:esri.Field) => {
          return field.domain;
        });
        fields.forEach(field => {
          //@ts-ignore
          field.checked = false;
          
          //@ts-ignore
          field.symbol = this.symbols.symbols.filter(symbol => {
            return symbol.name === field.name;
          })[0];
        });
        
        this.fields = fields;
        
        if(this.route.snapshot.children.length) {
      
          if (this.route.routeConfig.children[0].path === 'activities/:activities') {
            if (this.route.snapshot.children[0].params.activities) {
                if (this.route.snapshot.children[0].params.activities.split('-').length) {
                  this.route.snapshot.children[0].params.activities.split('-').forEach(activity => {
                    let fields = this.fields.filter(field => {
                      return  this.route.snapshot.children[0].params.activities.split('-').includes(field.name);
                    });
                    this.selected = this.route.snapshot.children[0].params.activities.split('-');
                    fields.forEach(field => {
                      //@ts-ignore
                      field.checked = true;

                    });
                  });
                } 

    
              }
          }          
        }     
    } catch {
      console.log("Layer not found");
    }

  }


}
