import { Component, OnInit } from '@angular/core';
import { circle, latLng, Layer, tileLayer } from 'leaflet';
import { Select, Store } from '@ngxs/store';
import { CovidState, ModeAffichage } from '../store/covid.state';
import { combineLatest, from, interval, Observable, zip } from 'rxjs';
import { StatistiqueParWilaya, TemporalFirstCases } from '../app.model';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';
import { ChangeDate, ChangeMode } from '../store/covid.actions';
import { AppService } from '../app.service';
import { isEmpty, map as _map, range } from 'lodash';

@Component({
  selector: 'dz-map',
  templateUrl: './dz-map.component.html',
  styleUrls: ['./dz-map.component.scss']
})
export class DzMapComponent implements OnInit {
  @Select(CovidState.getDatas) datas$: Observable<StatistiqueParWilaya[]>;
  @Select(CovidState.getMode) mode$: Observable<ModeAffichage>;
  @Select(CovidState.getDate) date$: Observable<moment.Moment | string>;

  options = {
    layers: [
      tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {maxZoom: 18})
    ],
    zoom: 5,
    center: latLng(27.4499077, 3.0233393)
  };
  layers$: Observable<Layer[]>;
  firstCaseMarkers = [];


  modeFormControl = new FormControl('confirmed_cases');
  dayFormControl = new FormControl(0);


  maxDays = 0;
  days: moment.Moment[] = [];
  animation = false;

  constructor(private store: Store, private service: AppService) {
  }

  ngOnInit(): void {
    this.days = this.service.getRangeOfAvailableStats();
    this.maxDays = this.days.length - 1;
    this.dayFormControl.setValue(this.maxDays);
    // a chaque fois que l'on change de jour dans le curseur on dispatch un changement de date, ainsi le getDatas rafraichit les données de l'écran
    this.dayFormControl.valueChanges.pipe(
      switchMap(index => this.store.dispatch(new ChangeDate(this.days[index])))
    ).subscribe();

    // a chaque fois qu'on change de mode, on dispatch une action de changement
    this.modeFormControl.valueChanges.pipe(tap(mode => {
      this.store.dispatch(new ChangeMode(mode));
    })).subscribe();

    // on rafraichit les données si la data$ change ou le mode
    this.layers$ = combineLatest([this.datas$, this.mode$])
      .pipe(map(([datas, mode]) => this.service.getMapMarkersByMode(datas, mode)));
  }

  /**
   * Lance une animation des marker pour les first_cases
   */
  animate() {
    this.animation = !this.animation;

    if (this.animation) {
      const interval$ = interval(1000);
      const temporal$ = this.datas$.pipe(
        filter(datas => !isEmpty(datas)), // filtre des falsy
        first(), // plusieurs valeurs pour tous les jours, on s'interesse à la première
        map(datas => this.service.getTemporalFirstCases(datas)), // clustering par date du first_case
        switchMap((datas: TemporalFirstCases) => from(Object.values(datas))), // emettre valeur pa valeur
      );

      zip(interval$, temporal$).pipe(
        map(([time, data]) => _map(data, d => circle(d.latlng, {radius: 10000, color: '#d13c4f', fillColor: '#d13c4f'}))),
        tap(markers => this.firstCaseMarkers = [...this.firstCaseMarkers, ...markers]),
      ).subscribe(() => {}, () => {}, () => { this.animation = false; });
    }

  }


}
