import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgEditorComponent } from './svg-editor.component';

describe('SvgEditorComponent', () => {
  let component: SvgEditorComponent;
  let fixture: ComponentFixture<SvgEditorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SvgEditorComponent]
    });
    fixture = TestBed.createComponent(SvgEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
