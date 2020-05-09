import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DzStackedChartComponent } from './dz-stacked-chart.component';

describe('DzStackedChartComponent', () => {
  let component: DzStackedChartComponent;
  let fixture: ComponentFixture<DzStackedChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DzStackedChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DzStackedChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
