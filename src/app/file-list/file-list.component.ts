import { Component, OnInit } from '@angular/core';
import { LoadedFile } from 'src/model/LoadedFile';
import { EnvironmentService } from 'src/shared/environment-service/environment.service';
import { WorkspaceService } from 'src/shared/workspace-service/workspace.service';

@Component({
  selector: 'app-file-list',
  templateUrl: './file-list.component.html',
  styleUrls: ['./file-list.component.css']
})
export class FileListComponent implements OnInit {
  files: LoadedFile[] = [];
  
  constructor(private workspaceService: WorkspaceService,
    private environmentService: EnvironmentService) {}

  ngOnInit(): void {
    this.environmentService.files$.subscribe((files) => { 
      this.files = files;
    });
  }

  loadFile = (file: LoadedFile): void => {
    this.workspaceService.loadFile(file);
  }
}
