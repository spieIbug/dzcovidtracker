import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { map as _map } from 'lodash';

export interface DailyStat {
  province: string;
  first_case: string;
  confirmed_cases: string;
  deaths: string;
  recoveries: string;
  latlng: [number, number];
}

@Injectable({
  providedIn: 'root',
})
export class StatsService {

  constructor(private http: HttpClient) {
  }

  getStatsForDay(date: moment.Moment): Observable<DailyStat[]> {
    return this.http.get(`assets/${moment.utc(date).format('YYYY-MM-DD')}.json`)
      .pipe(
        map((response: DailyStat[]) => {
            return _map(response, data => ({
              ...data,
              first_case: moment.utc(data.first_case).format('DD/MM/YYYY'),
            }));
          }
        )
      );
  }
}
