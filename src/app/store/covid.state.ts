import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ChangeMode, LoadData } from './covid.actions';
import { StatistiqueParWilaya } from '../app.model';
import { AppService } from '../app.service';
import * as moment from 'moment';
import { tap } from 'rxjs/operators';
import { sumBy } from 'lodash';

export type ModeAffichage = 'confirmed_cases' | 'deaths' | 'recoveries';

export interface DzCovidStateModel {
  datas: StatistiqueParWilaya[];
  mode: ModeAffichage;
  date: moment.Moment | string;
}

@State<DzCovidStateModel>({
  name: 'dzcovid',
  defaults: {
    datas: [],
    mode: 'confirmed_cases',
    date: moment.utc().add(-1, 'days'),
  }
})
@Injectable()
export class CovidState {


  constructor(private service: AppService) {
  }

  @Action(LoadData)
  loadData(ctx: StateContext<DzCovidStateModel>, action: LoadData) {
    return this.service.getStatsForDay(action.date)
      .pipe(tap(datas => {
        ctx.patchState({
          datas,
          date: action.date,
        });
      }));
  }

  @Action(ChangeMode)
  changeMode(ctx: StateContext<DzCovidStateModel>, action: ChangeMode) {
    ctx.patchState({
      mode: action.mode,
    });
  }

  @Selector()
  static getDatas(state: DzCovidStateModel): StatistiqueParWilaya[] {
    return state.datas;
  }

  @Selector()
  static getMode(state: DzCovidStateModel): ModeAffichage {
    return state.mode;
  }

  @Selector()
  static getDate(state: DzCovidStateModel): moment.Moment | string {
    return state.date;
  }

  @Selector()
  static getGlobalStats(state: DzCovidStateModel): {confirmed_cases: number, deaths: number, recoveries: number} {
    return {
      confirmed_cases: sumBy(state.datas, (data: StatistiqueParWilaya) => Number(data.confirmed_cases)),
      deaths: sumBy(state.datas, (data: StatistiqueParWilaya) => Number(data.deaths)),
      recoveries: sumBy(state.datas, (data: StatistiqueParWilaya) => Number(data.recoveries)),
    };
  }
}

