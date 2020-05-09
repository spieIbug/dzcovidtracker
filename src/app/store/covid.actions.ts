import * as moment from 'moment';
import { ModeAffichage } from './covid.state';

export class LoadData {
  static type = `[DZCOVID] Chargement de données`;
  constructor(public date?: moment.Moment | string) {}
}

export class ChangeMode {
  static type = `[DZCOVID] Changement de mode`;
  constructor(public mode: ModeAffichage = 'confirmed_cases') {}
}
