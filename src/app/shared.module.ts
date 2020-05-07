import { NgModule } from '@angular/core';
import { NbButtonModule, NbCardModule, NbLayoutModule } from '@nebular/theme';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { CommonModule } from '@angular/common';

const modules = [
  NbLayoutModule,
  NbButtonModule,
  NbCardModule,
  LeafletModule,
  CommonModule,
];

@NgModule({
  imports: modules,
  exports: modules,
})
export class SharedModule {

}
