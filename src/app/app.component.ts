import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Circle, circle, latLng, Layer, tileLayer } from 'leaflet';
import { StatistiqueParWilaya, StatsService } from './stats.service';
import * as moment from 'moment';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { range } from 'lodash';
import { FormControl } from '@angular/forms';

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
  totalRecorveredLayers: Layer[] = [];
  layers: Layer[] = [];

  currentWilaya: StatistiqueParWilaya;
  currentdate: moment.Moment;
  currentStats: StatistiqueParWilaya[] = [];
  wilaya = new FormControl();
  mode = new FormControl('confirmed_cases');

  barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [{
        stacked: true,
      }],
      xAxes: [{
        stacked: true,
      }]
    }
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'horizontalBar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    {data: [], label: 'Cas confirmés', backgroundColor: '#ececec'},
    {data: [], label: 'Morts', backgroundColor: '#ec1d39'},
    {data: [], label: 'guérisons', backgroundColor: '#1dec39'},
  ];

  constructor(private statsService: StatsService, private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.wilaya.valueChanges.subscribe((w: StatistiqueParWilaya) => {
      this.currentWilaya = w;
      if (this.currentWilaya) {
        this.updateBarChart([this.currentWilaya]);
        this.options.center = latLng(w.latlng[0], w.latlng[1]);
      } else {
        this.updateBarChart(this.currentStats);
      }
      this.changeDetector.detectChanges();
    });

    this.currentdate = moment.utc().add(-1, 'days');

    this.mode.valueChanges.subscribe(mode => {
      this.layers = this.getLayers(mode);
    });

    this.statsService.getStatsForDay(this.currentdate).subscribe((covid: StatistiqueParWilaya[]) => {
      this.currentStats = covid;
      this.updateBarChart(this.currentStats);
      this.totalCasesLayers = covid.map(dailyStat => {
        return this.totalCasesMarker(dailyStat).on('click', () => this.wilayaClick(dailyStat));
      });

      this.totalDeathsLayers = covid.map(dailyStat => {
        return this.totalDeathsMarker(dailyStat).on('click', () => this.wilayaClick(dailyStat));
      });

      this.totalRecorveredLayers = covid.map(dailyStat => {
        return this.totalRecorveredMarker(dailyStat).on('click', () => this.wilayaClick(dailyStat));
      });

      this.layers = this.totalCasesLayers;
    });
  }

  totalCasesMarker(dailyStat: StatistiqueParWilaya): Circle {
    return circle(dailyStat.latlng, {radius: Number(dailyStat.confirmed_cases) * 100, color: '#ececec', fillColor: '#ececec'})
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

  totalDeathsMarker(dailyStat: StatistiqueParWilaya): Circle {
    return circle(dailyStat.latlng, {radius: Number(dailyStat.deaths) * 1000, color: '#ec1d39', fillColor: '#ec1d39'})
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

  totalRecorveredMarker(dailyStat: StatistiqueParWilaya): Circle {
    return circle(dailyStat.latlng, {radius: Number(dailyStat.recoveries) * 100, color: '#1dec39', fillColor: '#1dec39'})
      .bindPopup(`<h5 style="color: var(--dark)">${dailyStat.province}</h5>
          <p>
            <dl>
              <dt>Premier cas signalé</dt><dd>${dailyStat.first_case}</dd>
              <dt>Nombre de cas</dt><dd>${dailyStat.recoveries}</dd>
              <dt style="color: var(--danger)">Nombre de morts</dt><dd>${dailyStat.deaths}</dd>
              <dt style="color: var(--success)">Nombre de guérisons</dt><dd>${dailyStat.recoveries}</dd>
            </dl>
          </p>`, {minWidth: 300});
  }

  wilayaClick(dailyStat: StatistiqueParWilaya) {
    this.currentWilaya = dailyStat;
    this.barChartLabels = [this.currentWilaya.province];
    this.barChartData[0].data = [Number(this.currentWilaya.confirmed_cases)];
    this.barChartData[1].data = [Number(this.currentWilaya.deaths)];
    this.barChartData[2].data = [Number(this.currentWilaya.recoveries)];
    this.changeDetector.detectChanges();
  }

  private updateBarChart(currentStats: StatistiqueParWilaya[]) {
    this.barChartLabels = currentStats.map(c => c.province);
    this.barChartData[0].data = currentStats.map(c => Number(c.confirmed_cases));
    this.barChartData[1].data = currentStats.map(c => Number(c.deaths));
    this.barChartData[2].data = currentStats.map(c => Number(c.recoveries));
  }

  getLayers(mode: 'confirmed_cases' | 'deaths' | 'recoveries' = 'confirmed_cases') {
    switch (mode) {
      case 'confirmed_cases': return this.totalCasesLayers;
      case 'deaths': return this.totalDeathsLayers;
      case 'recoveries': return this.totalRecorveredLayers;
    }
  }
}
