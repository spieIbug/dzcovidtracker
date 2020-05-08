import { NgModule } from '@angular/core';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

const modules = [
  LeafletModule,
  CommonModule,
  HttpClientModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class SharedModule {

}
