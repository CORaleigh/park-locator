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

  sections:any[] = [];
  sectionNames:string[] = [];
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
        if (!this.sectionNames.includes(cl.attributes.SECTION)) {
          let section = {name: cl.attributes.SECTION, icon:'', material:true};
          if (cl.attributes.SECTION === 'Art') {
            section.icon = 'palette';
          }
          if (cl.attributes.SECTION === 'Fitness') {
            section.icon = 'fitness_center';
          }
          if (cl.attributes.SECTION === 'Sports') {
            section.icon = 'sports_baseball';
          }          
          if (cl.attributes.SECTION === 'Athletic teams/leagues') {
            section.icon = 'sports';
          }          
          if (cl.attributes.SECTION === 'Social') {
            section.icon = 'group';
          }      
          if (cl.attributes.SECTION === 'School Programs') {
            section.icon = 'school';
          }         
          if (cl.attributes.SECTION === 'Educational') {
            section.icon = 'local_library';
          }      
          if (cl.attributes.SECTION === 'Nature') {
            section.icon = 'emoji_nature';
          }     
          if (cl.attributes.SECTION === 'Specialized Recreation') {
            section.icon = 'sports';
          }  
          if (cl.attributes.SECTION === 'City - Wide Special Events') {
            section.icon = 'location_city';
          }          
          if (cl.attributes.SECTION === 'Adventure') {
            section.icon = 'adventure';
            section.material = false;
          }          
          if (cl.attributes.SECTION === 'Aquatic') {
            section.icon = 'aquatic';
            section.material = false;
          }                              
          this.sections.push(section);
          this.sectionNames.push(section.name);

        }
      });
      //this.sections.sort();
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
