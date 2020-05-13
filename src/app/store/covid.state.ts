import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { ChangeDate, ChangeMode, LoadData } from './covid.actions';
import { StatistiqueParWilaya } from '../app.model';
import { AppService } from '../app.service';
import * as moment from 'moment';
import { tap } from 'rxjs/operators';
import { sumBy } from 'lodash';

export type ModeAffichage = 'confirmed_cases' | 'deaths' | 'recoveries';

export interface DzCovidStateModel {
  datas: { [day: string]: StatistiqueParWilaya[]};
  mode: ModeAffichage;
  date: moment.Moment | string;
}

@State<DzCovidStateModel>({
  name: 'dzcovid',
  defaults: {
    datas: {},
    mode: 'confirmed_cases',
    date: moment.utc().subtract(1, 'days'),
  }
})
@Injectable()
export class CovidState {


  constructor(private service: AppService) {
  }

  @Action(ChangeDate)
  changeDate(ctx: StateContext<DzCovidStateModel>, action: ChangeDate) {
    ctx.patchState({
      date: moment.utc(action.date),
    });
  }

  @Action(LoadData)
  loadData(ctx: StateContext<DzCovidStateModel>, action: LoadData) {
    const dateString = moment.utc(action.date).format('YYYYMMDD');
    return this.service.getStatsForDay(action.date)
      .pipe(tap(datas => {
        ctx.patchState({
          datas: {...ctx.getState().datas, [dateString]: datas},
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
    const dateString = moment.utc(state.date).format('YYYYMMDD');
    return state.datas[dateString];
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
    const dateString = moment.utc(state.date).format('YYYYMMDD');
    return {
      confirmed_cases: sumBy(state.datas[dateString], (data: StatistiqueParWilaya) => Number(data.confirmed_cases)),
      deaths: sumBy(state.datas[dateString], (data: StatistiqueParWilaya) => Number(data.deaths)),
      recoveries: sumBy(state.datas[dateString], (data: StatistiqueParWilaya) => Number(data.recoveries)),
    };
  }
}

