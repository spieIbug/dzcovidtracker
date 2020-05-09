import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { AppResource } from './app.resource';
import { StatistiqueParWilaya } from './app.model';
import { circle, Circle, Layer } from 'leaflet';
import { ModeAffichage } from './store/covid.state';
import { map as _map } from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class AppService {


  constructor(private resource: AppResource) {
  }

  getStatsForDay(date: moment.Moment | string): Observable<StatistiqueParWilaya[]> {
    return this.resource.getStatistics(date);
  }

  getMapMarkersByMode(datas: StatistiqueParWilaya[], mode: ModeAffichage): Layer[] {
    switch (mode) {
      case 'recoveries':
        return _map(datas, data => this.totalRecorveredMarker(data));
      case 'deaths':
        return _map(datas, data => this.totalDeathsMarker(data));
      default:
        return _map(datas, data => this.totalCasesMarker(data));
    }
  }

  totalCasesMarker(dailyStat: StatistiqueParWilaya): Circle {
    return circle(dailyStat.latlng, {radius: Number(dailyStat.confirmed_cases) * 100, color: '#17a2b8', fillColor: '#17a2b8'})
      .bindPopup(`<h5 style="color: var(--dark)">${dailyStat.province}</h5>
          <p>
            <dl>
              <dt>Premier cas signalé</dt><dd>${dailyStat.first_case}</dd>
              <dt class="text-info">Nombre de cas</dt><dd>${dailyStat.confirmed_cases}</dd>
              <dt class="text-danger">Nombre de morts</dt><dd>${dailyStat.deaths}</dd>
              <dt class="text-success">Nombre de guérisons</dt><dd>${dailyStat.recoveries}</dd>
            </dl>
          </p>`, {minWidth: 300});
  }

  totalDeathsMarker(dailyStat: StatistiqueParWilaya): Circle {
    return circle(dailyStat.latlng, {radius: Number(dailyStat.deaths) * 1000, color: '#d13c4f', fillColor: '#d13c4f'})
      .bindPopup(`<h5 style="color: var(--dark)">${dailyStat.province}</h5>
          <p>
            <dl>
              <dt>Premier cas signalé</dt><dd>${dailyStat.first_case}</dd>
              <dt class="text-info">Nombre de cas</dt><dd>${dailyStat.confirmed_cases}</dd>
              <dt class="text-danger">Nombre de morts</dt><dd>${dailyStat.deaths}</dd>
              <dt class="text-success">Nombre de guérisons</dt><dd>${dailyStat.recoveries}</dd>
            </dl>
          </p>`, {minWidth: 300});
  }

  totalRecorveredMarker(dailyStat: StatistiqueParWilaya): Circle {
    return circle(dailyStat.latlng, {radius: Number(dailyStat.recoveries) * 100, color: '#28a745', fillColor: '#28a745'})
      .bindPopup(`<h5 style="color: var(--dark)">${dailyStat.province}</h5>
          <p>
            <dl>
              <dt>Premier cas signalé</dt><dd>${dailyStat.first_case}</dd>
              <dt class="text-info">Nombre de cas</dt><dd>${dailyStat.confirmed_cases}</dd>
              <dt class="text-danger">Nombre de morts</dt><dd>${dailyStat.deaths}</dd>
              <dt class="text-success">Nombre de guérisons</dt><dd>${dailyStat.recoveries}</dd>
            </dl>
          </p>`, {minWidth: 300});
  }
}
