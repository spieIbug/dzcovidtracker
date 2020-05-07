import { NgModule } from '@angular/core';
import { NbSidebarModule, NbThemeModule } from '@nebular/theme';

@NgModule({
  imports: [
    NbThemeModule.forRoot({name: 'dark'}),
    NbSidebarModule.forRoot(),
  ],
})
export class CoreModule {

}
