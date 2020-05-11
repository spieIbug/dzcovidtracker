import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';
import { NgxsModule } from '@ngxs/store';
import { CovidState } from './store/covid.state';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';

@NgModule({
  imports: [
    NgxsModule.forRoot([CovidState], {
      developmentMode: !environment.production
    }),
    NgxsReduxDevtoolsPluginModule.forRoot({ disabled: environment.production }),
  ],
})
export class CoreModule {

}
