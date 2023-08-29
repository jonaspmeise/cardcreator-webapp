import { Component } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';
import { FileKeyValue } from 'src/model/FileKeyValue';
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

      fileEntry.file((file: File) => {
        this.fileTypeConverterService.getContent(file).then(
          content => {
            this.workspaceService.addFile(new FileKeyValue(
              ngxFile.relativePath, 
              content
            ));
          }
        );
      });
    });
  }

  public fileOver($event: any){
    console.log($event);
  }

  public fileLeave($event: any){
    console.log($event);
  }
}