import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FiletypeConverterService } from '../filetype-converter-service/filetype-converter.service';
import { LoadedFile } from 'src/model/LoadedFile';
import { ExcelLoaderService } from '../excel-loader-service/excel-loader.service';
import { RenderService } from '../render-service/render.service';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private filesSubject = new BehaviorSubject<LoadedFile[]>([]);
  private cardsSubject = new BehaviorSubject<any[]>([]);
  private selectedCardSubject = new BehaviorSubject<any>({columnA: 'value1', columB: 'value2'})
  private svgCodeSubject = new BehaviorSubject<string>('<svg xmlns="http://www.w3.org/2000/svg" width="200" height="100"><circle cx="50" cy="50" r="40" stroke="black" stroke-width="2" fill="red" /></svg>');
  private imageSubject = new BehaviorSubject<string | null>(null);

  files$= this.filesSubject.asObservable();
  cards$ = this.cardsSubject.asObservable();
  selectedCard$ = this.selectedCardSubject.asObservable();
  svgCode$ = this.svgCodeSubject.asObservable();
  image$ = this.imageSubject.asObservable();

  constructor(private fileTypeConverterService: FiletypeConverterService, 
    private excelLoaderService: ExcelLoaderService,
    private renderService: RenderService) {}

  renderSVG = (svgCode: string): void => {
    this.svgCodeSubject.next(svgCode);
    this.updateSVG();
  }

  private updateSVG() {
    const svgCode = this.svgCodeSubject.getValue();
    console.log('Rendering card', svgCode);

    this.imageSubject.next(`data:image/svg+xml;base64,${btoa( //convert to base64
      this.renderService.evaluateFunctions(svgCode, this.selectedCardSubject.getValue())
    )}`);
  }

  addFile = (file: LoadedFile): void => {
    const newFiles = [...this.filesSubject.getValue(), file];

    this.filesSubject.next(newFiles);
  }

  clearFiles = (): void => {
    this.filesSubject.next([]);
  }

  selectCard = (card: any): void => {
    this.selectedCardSubject.next(card);
    this.updateSVG();
  }

  loadFile = (file: LoadedFile): void => {
    const type = this.fileTypeConverterService.getFileType(file.file);

    switch(type) {
      case 'image':
        this.imageSubject.next(file.content);
        break;
      case 'text':
        //TODO: Check whether we'll overwrite something here first!
        this.svgCodeSubject.next(file.content);
        break;
      case 'table':
        this.cardsSubject.next(this.excelLoaderService.load(file.content as Uint8Array));
        break;
      case 'other':
        //TODO
    }
  }
}
