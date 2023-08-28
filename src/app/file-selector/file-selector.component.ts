import { Component, OnInit } from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry, FileSystemDirectoryEntry } from 'ngx-file-drop';
import { FileService } from '../../shared/file-service/file.service';
import { Observable } from 'rxjs';
import { FileKeyValue } from 'src/model/FileKeyValue';

@Component({
  selector: 'app-file-selector',
  templateUrl: './file-selector.component.html',
  styleUrls: ['./file-selector.component.css']
})
export class FileSelectorComponent {

  constructor(private fileService: FileService) {}

  public onDrop(uploadedFiles: NgxFileDropEntry[]) {
    console.log(uploadedFiles);

    uploadedFiles.forEach(file => {
      const fileEntry = file.fileEntry as FileSystemFileEntry;

      fileEntry.file((file: File) => {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          const content = event.target.result;

          this.fileService.add(new FileKeyValue(file.webkitRelativePath, content));
        };

        reader.readAsText(file);
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