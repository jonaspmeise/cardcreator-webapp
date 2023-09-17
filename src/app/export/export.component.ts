import { Component, OnInit } from '@angular/core';
import { ExportService } from 'src/shared/export-service/export.service';
import { WorkspaceService } from 'src/shared/workspace-service/workspace.service';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.css']
})
export class ExportComponent {
  constructor(private exportService: ExportService,
    private workspaceService: WorkspaceService) {}

  exportData = () => {
    this.exportService.startExport();
  };

  onTextareaInput(target: any): void {
    this.exportService.updateFilenameWildcard(target.value);
  }

  exportSettings = () => {
    this.workspaceService.saveSettings();
  }
}
