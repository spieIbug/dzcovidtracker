import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { range } from 'lodash';
import { Select, Store } from '@ngxs/store';
import { LoadData } from './store/covid.actions';
import { CovidState } from './store/covid.state';
import { Observable } from 'rxjs';
import { StatistiqueParWilaya } from './app.model';

@Component({
  selector: 'dz-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @Select(CovidState.getGlobalStats) globalStats$: Observable<{confirmed_cases: number, deaths: number, recoveries: number}>;

  constructor(private store: Store) {
  }

  ngOnInit(): void {
    this.store.dispatch(new LoadData(moment.utc().add(-1, 'days')));
  }
}
