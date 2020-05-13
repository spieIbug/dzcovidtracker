/* tslint:disable */
export class StatistiqueParWilaya {
  province: string;
  first_case: string;
  confirmed_cases: string;
  deaths: string;
  recoveries: string;
  latlng: [number, number];


  constructor(stat?: Partial<StatistiqueParWilaya>) {
    Object.assign(this, stat);
  }
}

export type FirstCase = { province: string, latlng: [number, number], first_case: string };
export type TemporalFirstCases = { [date: string]: FirstCase };
