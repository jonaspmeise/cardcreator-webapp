import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { FileKeyValue } from 'src/model/FileKeyValue';
import { WorkspaceService } from 'src/shared/workspace-service/workspace.service';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {
  files$!: Observable<FileKeyValue[]>;
  
  constructor(private workspaceService: WorkspaceService) {}

  ngOnInit(): void {
    this.files$ = this.workspaceService.getFiles$();
  }
}
