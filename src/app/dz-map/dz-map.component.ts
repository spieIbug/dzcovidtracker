import { Component, OnInit } from '@angular/core';
import { Circle, circle, latLng, Layer, tileLayer } from 'leaflet';
import { Select, Store } from '@ngxs/store';
import { CovidState, ModeAffichage } from '../store/covid.state';
import { combineLatest, Observable } from 'rxjs';
import { StatistiqueParWilaya } from '../app.model';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { map, tap } from 'rxjs/operators';
import { ChangeMode } from '../store/covid.actions';
import { AppService } from '../app.service';

@Component({
  selector: 'dz-map',
  templateUrl: './dz-map.component.html',
  styleUrls: ['./dz-map.component.scss']
})
export class DzMapComponent implements OnInit {
  options = {
    layers: [
      tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {maxZoom: 18})
    ],
    zoom: 5,
    center: latLng(27.4499077, 3.0233393)
  };


  @Select(CovidState.getDatas) datas$: Observable<StatistiqueParWilaya[]>;
  @Select(CovidState.getMode) mode$: Observable<ModeAffichage>;
  @Select(CovidState.getDate) date$: Observable<moment.Moment | string>;
  modeFormControl = new FormControl('confirmed_cases');
  layers$: Observable<Layer[]>;

  constructor(private store: Store, private service: AppService) {
  }

  ngOnInit(): void {
    this.layers$ = combineLatest([this.datas$, this.mode$])
      .pipe(map(([datas, mode]) => this.service.getMapMarkersByMode(datas, mode)));

    this.modeFormControl.valueChanges.pipe(tap(mode => {
      this.store.dispatch(new ChangeMode(mode));
    })).subscribe();
  }


}
