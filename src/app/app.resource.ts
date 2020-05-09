import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as moment from 'moment';
import { StatistiqueParWilaya } from './app.model';
import { map as _map } from 'lodash';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AppResource {
  constructor(private http: HttpClient) {
  }

  getStatistics(date: moment.Moment | string): Observable<StatistiqueParWilaya[]> {
    return this.http.get(`assets/${moment.utc(date).format('YYYY-MM-DD')}.json`)
      .pipe(
        map((response: StatistiqueParWilaya[]) => {
            return _map(response, data => new StatistiqueParWilaya({
              ...data,
              confirmed_cases: data.confirmed_cases,
              first_case: moment.utc(data.first_case).format('DD/MM/YYYY'),
            }));
          }
        )
      );
  }
}
