import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardSheetComponent } from './card-sheet.component';

describe('CardSheetComponent', () => {
  let component: CardSheetComponent;
  let fixture: ComponentFixture<CardSheetComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CardSheetComponent]
    });
    fixture = TestBed.createComponent(CardSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
