import { Injectable, OnInit } from '@angular/core';
import { WorkspaceService } from '../workspace-service/workspace.service';
import { BehaviorSubject } from 'rxjs';
import { EnvironmentService } from '../environment-service/environment.service';
import * as JSZip from 'jszip';
import { RenderService } from '../render-service/render.service';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private filenameWildcardSubject = new BehaviorSubject<string>('');
  private filenameWildcard$ = this.filenameWildcardSubject.asObservable();

  private environment!: Map<string, string>;
  private cards!: any[];
  private svgCode!: string;

  constructor(private environmentService: EnvironmentService,
    private workspaceService: WorkspaceService,
    private renderService: RenderService) {
      this.environmentService.environment$.subscribe((environment) => {
        this.environment = environment;
      });
  
      this.workspaceService.cards$.subscribe((cards) => {
        this.cards = cards;
      });
  
      this.workspaceService.svgCode$.subscribe((svgCode) => {
        this.svgCode = svgCode;
      });
    }

  private renderToPng = (svgBase64: string, filename: string): Promise<{blob: Blob | null, filename: string}> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
    
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx!.drawImage(img, 0, 0);

        console.log('Finished rendering', filename, '!');
        canvas.toBlob((blob) => resolve({blob: blob, filename: filename}), "image/png");
      };

      console.log('Awaiting rendering', filename, '...');
      img.src = svgBase64;
    });
  };

  updateFilenameWildcard = (filenameWildcard: string): void => {
    this.filenameWildcardSubject.next(filenameWildcard);
  }

  startExport = async () => {
    const svgCode = this.svgCode;
    const zip = new JSZip();

    for(let index = 0; index < this.cards.length; index++) {
      const card = this.cards[index];
      console.log('started parsing', card);

      const imageSvgCode = this.renderService.evaluateFunctions(svgCode, card, this.environment);

      const blob = await this.renderToPng(
        this.renderService.renderSvgXmlToBase64(imageSvgCode), 
        this.renderService.evaluateFunctions(this.filenameWildcardSubject.getValue(), card, this.environment)
      );

      if(!blob.blob) continue;

      zip.file(blob.filename, blob.blob);

      console.log('Zipped card ', index, ' of ', this.cards.length - 1);

      if(index < this.cards.length - 1) continue;

      zip.generateAsync({ type: 'blob' }).then((zipBlob) => {
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(zipBlob);

        downloadLink.download = 'images.zip';
        downloadLink.click();
  
        URL.revokeObjectURL(downloadLink.href);
      });
    }
  };
}
