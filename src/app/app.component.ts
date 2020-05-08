import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Circle, circle, latLng, Layer, tileLayer } from 'leaflet';
import { DailyStat, StatsService } from './stats.service';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dzcovidtracker';
  options = {
    layers: [
      tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {maxZoom: 18, attribution: '...'})
    ],
    zoom: 5,
    center: latLng(27.4499077, 3.0233393)
  };

  layersControl = {
    overlays: {
      'Big Circle': circle([27.4499077, 3.0233393], {radius: 50000}),
    }
  };

  totalCasesLayers: Layer[] = [];
  totalDeathsLayers: Layer[] = [];
  currentWilaya: DailyStat;
  currentdate: moment.Moment;

  constructor(private statsService: StatsService, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.currentdate = moment.utc();
    this.statsService.getStatsForDay(this.currentdate).subscribe((covid: DailyStat[]) => {
      this.totalCasesLayers = covid.map(dailyStat => {
        return this.totalCasesMarker(dailyStat).on('click', () => this.wilayaClick(dailyStat));
      });

      this.totalDeathsLayers = covid.map(dailyStat => {
        return this.totalDeathsMarker(dailyStat).on('click', () => this.wilayaClick(dailyStat));
      });
    });
  }

  totalCasesMarker(dailyStat: DailyStat): Circle {
    return circle(dailyStat.latlng, {radius: Number(dailyStat.confirmed_cases) * 100})
      .bindPopup(`<h5 style="color: var(--dark)">${dailyStat.province}</h5>
          <p>
            <dl>
              <dt>Premier cas signalé</dt><dd>${dailyStat.first_case}</dd>
              <dt>Nombre de cas</dt><dd>${dailyStat.confirmed_cases}</dd>
              <dt style="color: var(--danger)">Nombre de morts</dt><dd>${dailyStat.deaths}</dd>
              <dt style="color: var(--success)">Nombre de guérisons</dt><dd>${dailyStat.recoveries}</dd>
            </dl>
          </p>`, {minWidth: 300});
  }

  totalDeathsMarker(dailyStat: DailyStat): Circle {
    return circle(dailyStat.latlng, {radius: Number(dailyStat.deaths) * 1000, color: '#ff0000', fillColor: '#f10000'})
      .bindPopup(`<h5 style="color: var(--dark)">${dailyStat.province}</h5>
          <p>
            <dl>
              <dt>Premier cas signalé</dt><dd>${dailyStat.first_case}</dd>
              <dt>Nombre de cas</dt><dd>${dailyStat.confirmed_cases}</dd>
              <dt style="color: var(--danger)">Nombre de morts</dt><dd>${dailyStat.deaths}</dd>
              <dt style="color: var(--success)">Nombre de guérisons</dt><dd>${dailyStat.recoveries}</dd>
            </dl>
          </p>`, {minWidth: 300});
  }

  wilayaClick(dailyStat: DailyStat) {
    this.currentWilaya = dailyStat;
    console.log(this.currentWilaya);
    this.changeDetector.detectChanges();
  }


}
