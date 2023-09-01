import { Component } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { LoadedFile } from 'src/model/LoadedFile';
import { EnvironmentService } from 'src/shared/environment-service/environment.service';
import { FiletypeConverterService } from 'src/shared/filetype-converter-service/filetype-converter.service';
import { WorkspaceService } from 'src/shared/workspace-service/workspace.service';

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.css']
})
export class FileSelectorComponent {

  constructor(private environmentService: EnvironmentService, private fileTypeConverterService: FiletypeConverterService) {}

  public onDrop(uploadedFiles: NgxFileDropEntry[]) {
    uploadedFiles.forEach(ngxFile => {
      const fileEntry = ngxFile.fileEntry as FileSystemFileEntry;

      if(!fileEntry.isFile) return;

      fileEntry.file((file: File) => {
        this.environmentService.addFile(file, ngxFile.relativePath);
      });
    });
  }
}