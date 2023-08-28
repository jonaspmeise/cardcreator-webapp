import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FileKeyValue } from 'src/model/FileKeyValue';
import { FileService } from 'src/shared/file-service/file.service';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {
  files: FileKeyValue[] = [];
  
  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.fileService.files$.subscribe(files => {
      this.files = files;
    });
  }
}
