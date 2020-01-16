import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmenityFilterComponent } from './amenity-filter.component';

describe('AmenityFilterComponent', () => {
  let component: AmenityFilterComponent;
  let fixture: ComponentFixture<AmenityFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmenityFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmenityFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
