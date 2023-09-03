import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RenderService } from 'src/shared/render-service/render.service';
import { WorkspaceService } from 'src/shared/workspace-service/workspace.service';

@Component({
  selector: 'app-svg-editor',
  templateUrl: './svg-editor.component.html',
  styleUrls: ['./svg-editor.component.css']
})
export class SvgEditorComponent implements OnInit {
  @ViewChild('svgTextarea', { static: true }) svgTextarea!: ElementRef<HTMLTextAreaElement>;

  constructor(private workspaceService: WorkspaceService,
    private renderService: RenderService) {}

  ngOnInit(): void {
    this.workspaceService.svgCode$.subscribe(code => {
      this.svgTextarea.nativeElement.value = code;
    });
  }

  onSvgContentChange(): void {
    const newSvgContent = this.svgTextarea.nativeElement.value;
    this.workspaceService.updateSVGCode(newSvgContent);
  }

  //quick hack to be able to tab within a textarea: https://stackoverflow.com/questions/68068940/tab-inside-textarea-element-in-typescript-angular
  handleKeydown = (event:any) => {
    if (event.key == 'Tab') {
        event.preventDefault();
        var start = event.target.selectionStart;
        var end = event.target.selectionEnd;
        event.target.value = event.target.value.substring(0, start) + '\t' + event.target.value.substring(end);
        event.target.selectionStart = event.target.selectionEnd = start + 1;
    }
}
}
