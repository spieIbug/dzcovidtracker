import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { StatistiqueParWilaya } from '../app.model';
import { Select } from '@ngxs/store';
import { CovidState } from '../store/covid.state';
import { Observable } from 'rxjs';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'dz-dz-stacked-chart',
  templateUrl: './dz-stacked-chart.component.html',
  styleUrls: ['./dz-stacked-chart.component.scss']
})
export class DzStackedChartComponent implements OnInit {

  @Select(CovidState.getDatas) datas$: Observable<StatistiqueParWilaya[]>;
  currentStats: StatistiqueParWilaya[];
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
    {data: [], label: 'Cas confirmés', backgroundColor: '#17a2b8'},
    {data: [], label: 'Morts', backgroundColor: '#d13c4f'},
    {data: [], label: 'guérisons', backgroundColor: '#28a745'},
  ];
  wilaya = new FormControl();

  constructor(private changeDetector: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.datas$.subscribe(datas => {
      this.currentStats = datas;
      this.updateBarChart(this.currentStats);
      this.changeDetector.detectChanges();
    });

    this.wilaya.valueChanges.subscribe((wilaya: StatistiqueParWilaya) => {
      wilaya ? this.updateBarChart([wilaya]) : this.updateBarChart(this.currentStats);
      this.changeDetector.detectChanges();
    });
  }


  private updateBarChart(currentStats: StatistiqueParWilaya[]) {
    this.barChartLabels = currentStats.map(c => c.province);
    this.barChartData[0].data = currentStats.map(c => Number(c.confirmed_cases));
    this.barChartData[1].data = currentStats.map(c => Number(c.deaths));
    this.barChartData[2].data = currentStats.map(c => Number(c.recoveries));
  }

}
