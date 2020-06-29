import { Component, OnInit } from '@angular/core';
import { groupBy, isEmpty, orderBy, range } from 'lodash';
import { Select, Store } from '@ngxs/store';
import { LoadData } from './store/covid.actions';
import { CovidState } from './store/covid.state';
import { forkJoin, Observable } from 'rxjs';
import { StatistiqueParWilaya } from './app.model';
import { AppService } from './app.service';
import { switchMap } from 'rxjs/operators';


@Component({
  selector: 'dz-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  @Select(CovidState.getGlobalStats) globalStats$: Observable<{ confirmed_cases: number, deaths: number, recoveries: number }>;
  @Select(CovidState.getDatas) datas$: Observable<StatistiqueParWilaya[]>;

  constructor(private store: Store, private service: AppService) {
  }

  ngOnInit(): void {
    // Chargement des toutes les données dans le store depuis le lancement. On lance d'abord le premier jour. Ensuite le reste
    const days = this.service.getRangeOfAvailableStats();
    this.store.dispatch(new LoadData(days.shift())).pipe(
      switchMap(() => forkJoin([
        ...days.map(day => this.store.dispatch(new LoadData(day))),
      ]))).subscribe();
  }
}
