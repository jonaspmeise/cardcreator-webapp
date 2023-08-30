import { Component, OnInit } from '@angular/core';
import { WorkspaceService } from 'src/shared/workspace-service/workspace.service';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.css']
})
export class ImagePreviewComponent implements OnInit {
  image!: string;
  
  constructor(private workspaceService: WorkspaceService) {}

  ngOnInit(): void {
    this.workspaceService.image$.subscribe(image => {
      if(!image) return;
      
      this.image = image;
    });
  }
}
