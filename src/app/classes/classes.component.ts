import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { loadModules } from 'esri-loader';
import esri = __esri;
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.scss']
})
export class ClassesComponent implements OnInit, OnChanges {
  @Input('classes') classes:esri.Graphic[] = [];
  sections:string[] = [];
  classList:esri.Graphic[] = [];
  columns:number = 4;
  constructor(breakpointObserver: BreakpointObserver) {
    breakpointObserver.observe([
      Breakpoints.Handset   
    ]).subscribe(result => {
      if (result.matches) {
        this.columns = 1;
      } 
    });

    breakpointObserver.observe([
      Breakpoints.Medium,
      Breakpoints.Tablet,
      Breakpoints.XSmall,
      Breakpoints.Small   
    ]).subscribe(result => {
      if (result.matches) {
        this.columns = 2;
      } 
    });         
    breakpointObserver.observe([
      Breakpoints.Large,
      Breakpoints.XLarge
    ]).subscribe(result => {
      if (result.matches) {
        this.columns = 3;
      } 
    });      
  }
  ngOnChanges(change:SimpleChanges) {
    if (change.classes) {
      this.classList = [];
      this.classes.forEach(cl => {
        if (!this.sections.includes(cl.attributes.SECTION)) {
          this.sections.push(cl.attributes.SECTION);
        }
      });
      this.sections.sort();
    }
  }

  sectionSelected(section:string) {
    this.classList = this.classes.filter(cl => {
      return cl.attributes.SECTION === section;
    });
    this.classList.sort((a,b) => {
      return a.attributes.START_DATE - b.attributes.START_DATE;
    });
  }
  ngOnInit() {
  }

}
