import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FiletypeConverterService } from '../filetype-converter-service/filetype-converter.service';
import { LoadedFile } from 'src/model/LoadedFile';
import { ExcelLoaderService } from '../excel-loader-service/excel-loader.service';
import { RenderService } from '../render-service/render.service';

import * as XLSX from 'xlsx';
import { ExportService } from '../export-service/export.service';
import * as JSZip from 'jszip';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private cardsSubject = new BehaviorSubject<any[]>([]);
  private selectedCardSubject = new BehaviorSubject<any>(null);
  private svgCodeSubject = new BehaviorSubject<string>('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="2" fill="red" /></svg>');
  private imageSubject = new BehaviorSubject<string | null>(null);
  private currentSheetSubject = new BehaviorSubject<string | null>(null);
  private availableSheetsSubject = new BehaviorSubject<string[]>([]);
  private currentWorkbookSubject = new BehaviorSubject<XLSX.WorkBook | null>(null);

  cards$ = this.cardsSubject.asObservable();
  selectedCard$ = this.selectedCardSubject.asObservable();
  svgCode$ = this.svgCodeSubject.asObservable();
  image$ = this.imageSubject.asObservable();
  currentSheet$ = this.currentSheetSubject.asObservable();
  availableSheets$ = this.availableSheetsSubject.asObservable();
  currentWorkbook$ = this.currentWorkbookSubject.asObservable();

  constructor(private fileTypeConverterService: FiletypeConverterService, 
    private excelLoaderService: ExcelLoaderService) {}

  selectCard = (card: any): void => {
    this.selectedCardSubject.next(card);
  };

  switchSheet = (sheet: any): void => {
    if(!this.availableSheetsSubject.getValue().includes(sheet)) return;

    this.currentSheetSubject.next(sheet);
    this.updateCards();
  };

  showImage = (image: string): void => {
    this.imageSubject.next(image);
  };

  updateSVGCode = (svgCode: string): void => {
    this.svgCodeSubject.next(svgCode);
  }

  updateCards = (): void => {
    const workbook = this.currentWorkbookSubject.getValue();
    if(!workbook) return;

    this.cardsSubject.next(this.excelLoaderService.load(
      workbook, 
      this.currentSheetSubject.getValue()
    ));
  };

  loadFile = (file: LoadedFile): void => {
    const type = this.fileTypeConverterService.getFileType(file.file);

    //TODO: Check whether we'll overwrite something here first!
    switch(type) {
      case 'image':
        this.imageSubject.next(file.content);
        break;
      case 'text':
        this.svgCodeSubject.next(file.content);
        break;
      case 'table':
        this.currentWorkbookSubject.next(XLSX.read(file.content as Uint8Array, { type: 'array' }));
        this.availableSheetsSubject.next(this.currentWorkbookSubject.getValue()!.SheetNames || []);
        this.updateCards();
        break;
      case 'other':
        //TODO
    }
  }
}
