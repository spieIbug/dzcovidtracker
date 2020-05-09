import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DzMapComponent } from './dz-map.component';

describe('DzMapComponent', () => {
  let component: DzMapComponent;
  let fixture: ComponentFixture<DzMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DzMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DzMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
