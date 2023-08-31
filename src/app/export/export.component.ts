import { Component, OnInit } from '@angular/core';
import { WorkspaceService } from 'src/shared/workspace-service/workspace.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent {
  filenameWildcard: string = '';

  constructor(private workspaceService: WorkspaceService) {}

  exportData = () => {
    this.workspaceService.startExport(this.filenameWildcard);
  };

  onTextareaInput(value: any): void {
    if(!value) return;

    this.filenameWildcard = value;
  }
}
