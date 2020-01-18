import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { loadModules } from 'esri-loader';
import { ActivatedRoute, Router } from '@angular/router';

import esri = __esri;
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit  {
  toggleField:esri.Field = null;
  classes:esri.Graphic[] = [];
  parkInfoFull:boolean = false;
  ngOnInit() {
    
  }
  isHandset$: Observable<boolean> = this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints
    .Small, Breakpoints.XSmall, Breakpoints.TabletPortrait
  ])
    .pipe(
      map(result => result.matches),
      shareReplay()
    );


  constructor(private breakpointObserver: BreakpointObserver,private route: ActivatedRoute, private router:Router) {

    if (this.route.routeConfig) {
      
      if(this.route.snapshot.children.length) {
  
            if (this.route.snapshot.children[0].params.activities) {
              let where:string = "1=1";
              
              if (this.route.snapshot.children[0].params.activities.split('-').length) {
                if (this.route.snapshot.children[0].params.activities.split('-').length === 1) {
                  where = " " + this.route.snapshot.children[0].params.activities + " = 'Yes'";
                } else {
                  where = " " + this.route.snapshot.children[0].params.activities.replace(/-/g, " = 'Yes' OR ")+ " = 'Yes'";
                }
              } 
              this.where = where;
  
            }
  
      }
    
    }     
  }
  view:esri.MapView = null;
  viewLoaded(view: esri.MapView) {
   
    this.view = view;
  }
  parkLayer:esri.FeatureLayer = null;
  parkLayerLoaded(layer: esri.FeatureLayer) {
    this.parkLayer = layer;
    
    if (this.where) {
      
      this.parkLayer.definitionExpression = this.where;
    }
  }
  where:string = "1=1"
  parksFiltered(where:string) {
    this.where = where;

  }

  selectedPark:esri.Graphic = null;
  parkSelected(park:esri.Graphic, drawer) {
    this.isHandset$.subscribe((isHandset) => {
      if (isHandset.valueOf()) {
        drawer.close();
      }
    });
      
    
    this.selectedPark = park;
    this.classes = [];
    this.router.navigate(['park', this.selectedPark.attributes.NAME.toString().toLowerCase().replace(/ /g, '_')]);
    (this.selectedPark.layer as esri.FeatureLayer).queryRelatedFeatures({relationshipId:0,objectIds:[this.selectedPark.attributes.OBJECTID], outFields:['*']}).then((result:any) => {
      if (result[this.selectedPark.attributes.OBJECTID] != undefined) {
        this.classes = result[this.selectedPark.attributes.OBJECTID].features;
      } else {
        this.classes = [];

      }
    });
    if (this.isHandset$) {

    }
  }

  chipClicked(chip:esri.Field) {
    this.toggleField = chip;
  }

  clearPark() {
    this.selectedPark = null;
    this.router.navigate(['']);

  }

}
