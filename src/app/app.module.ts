import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation/navigation.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MapComponent } from './map/map.component';
import { ParkListComponent } from './park-list/park-list.component';
import { AmenityFilterComponent } from './amenity-filter/amenity-filter.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatTooltipModule} from '@angular/material/tooltip';
import { ParkNamePipe } from './park-name.pipe';
import { ParkInfoComponent } from './park-info/park-info.component';
import { ClassesComponent } from './classes/classes.component';
@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    MapComponent,
    ParkListComponent,
    AmenityFilterComponent,
    ParkNamePipe,
    ParkInfoComponent,
    ClassesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatChipsModule,MatGridListModule,
    HttpClientModule,
    MatTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
