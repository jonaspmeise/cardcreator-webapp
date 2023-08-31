import { Component } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { LoadedFile } from 'src/model/LoadedFile';
import { FiletypeConverterService } from 'src/shared/filetype-converter-service/filetype-converter.service';
import { WorkspaceService } from 'src/shared/workspace-service/workspace.service';

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.css']
})
export class FileSelectorComponent {

  constructor(private workspaceService: WorkspaceService, private fileTypeConverterService: FiletypeConverterService) {}

  public onDrop(uploadedFiles: NgxFileDropEntry[]) {
    uploadedFiles.forEach(ngxFile => {
      const fileEntry = ngxFile.fileEntry as FileSystemFileEntry;

      if(!fileEntry.isFile) return;

      fileEntry.file((file: File) => {
        this.fileTypeConverterService.getContent(file).then(
          content => {
            this.workspaceService.addFile(new LoadedFile(
              file,
              ngxFile.relativePath, 
              content
            ));
          }
        );
      });
    });
  }
}