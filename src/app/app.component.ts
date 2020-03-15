import { Component } from '@angular/core';
import { MatIconRegistry } from "@angular/material/icon";
import { Symbols } from './symbols';
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'park-locator';
  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer:DomSanitizer){
    const symbols = new Symbols().symbols.filter(symbol => {
      return symbol.source === 'nps';
    });
    this.matIconRegistry.addSvgIcon(
      'adventure',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/technical-rock-climb-white-22.svg')
    );    
    this.matIconRegistry.addSvgIcon(
      'aquatic',
      this.domSanitizer.bypassSecurityTrustResourceUrl('./assets/swimming-white-22.svg')
    );      
  
    symbols.forEach(symbol => {
      this.matIconRegistry.addSvgIcon(
        symbol.name,
        this.domSanitizer.bypassSecurityTrustResourceUrl(symbol.symbol)
      );
    })



  }
}
