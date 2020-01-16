import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ParkInfoComponent } from './park-info.component';

describe('ParkInfoComponent', () => {
  let component: ParkInfoComponent;
  let fixture: ComponentFixture<ParkInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ParkInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ParkInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
