import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FiletypeConverterService } from '../filetype-converter-service/filetype-converter.service';
import { LoadedFile } from 'src/model/LoadedFile';
import { ExcelLoaderService } from '../excel-loader-service/excel-loader.service';
import { RenderService } from '../render-service/render.service';

import * as XLSX from 'xlsx';
import { ExportService } from '../export-service/export.service';
import * as JSZip from 'jszip';
import { EnvironmentService } from '../environment-service/environment.service';
import { ProjectSettings } from 'src/model/ProjectSettings';

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

  private tableFilePath: string = "";

  cards$ = this.cardsSubject.asObservable();
  selectedCard$ = this.selectedCardSubject.asObservable();
  svgCode$ = this.svgCodeSubject.asObservable();
  image$ = this.imageSubject.asObservable();
  currentSheet$ = this.currentSheetSubject.asObservable();
  availableSheets$ = this.availableSheetsSubject.asObservable();
  currentWorkbook$ = this.currentWorkbookSubject.asObservable();

  constructor(private fileTypeConverterService: FiletypeConverterService, 
    private excelLoaderService: ExcelLoaderService,
    private environmentService: EnvironmentService) {}

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

  saveSettings = (): void => {
    const projectSettings: ProjectSettings = {
      code: this.svgCodeSubject.getValue(),
      tableFilePath: this.tableFilePath,
      environmentVariables: this.environmentService.getEnvironmentVariables()
    };

    const jsonBlob = new Blob([JSON.stringify(projectSettings, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(jsonBlob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "cardcreator.project";

    a.click();
    URL.revokeObjectURL(url);
  }

  loadFile = (file: LoadedFile): void => {
    const type = this.fileTypeConverterService.getFileType(file.file);

    //TODO: Check whether we'll overwrite something here first!
    switch(type) {
      case 'project':
        this.loadProjectSettings(file);
        break;
      case 'image':
        this.imageSubject.next(file.content);
        break;
      case 'text':
        this.svgCodeSubject.next(file.content);
        break;
      case 'table':
        this.currentWorkbookSubject.next(XLSX.read(file.content as Uint8Array, { type: 'array' }));
        this.availableSheetsSubject.next(this.currentWorkbookSubject.getValue()!.SheetNames || []);

        this.tableFilePath = file.path || '';
        this.updateCards();
        break;
      case 'other':
        //TODO
    }
  }

  loadProjectSettings = (file: LoadedFile): void => {
    const json = JSON.parse(file.content as string);
    const settings = json as ProjectSettings;

    //propagate the loaded values into the correct places
    this.svgCodeSubject.next(settings.code);
    this.environmentService.setEnvironmentVariables(settings.environmentVariables);

    if(settings.tableFilePath === undefined) return;

    this.currentWorkbookSubject.next(XLSX.read(this.environmentService.getFileContent(settings.tableFilePath) as Uint8Array, {type: 'array'}));
    this.tableFilePath = file.path || '';
  }
}
