import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared.module';
import { CoreModule } from './core.module';
import { DzMapComponent } from './dz-map/dz-map.component';
import { DzStackedChartComponent } from './dz-stacked-chart/dz-stacked-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    DzMapComponent,
    DzStackedChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CoreModule,
    SharedModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
