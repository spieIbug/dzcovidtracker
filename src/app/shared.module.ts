import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChartsModule } from 'ng2-charts';
import { ReactiveFormsModule } from '@angular/forms';

const modules = [
  LeafletModule,
  CommonModule,
  HttpClientModule,
  ChartsModule,
  ReactiveFormsModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class SharedModule {

}
