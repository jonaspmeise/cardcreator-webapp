import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkspaceService } from 'src/shared/workspace-service/workspace.service';

@Component({
  selector: 'app-card-sheet',
  templateUrl: './card-sheet.component.html',
  styleUrls: ['./card-sheet.component.css']
})
export class CardSheetComponent implements OnInit {
  cards$!: Observable<any[]>;

  constructor(private workspaceService: WorkspaceService) {}

  ngOnInit(): void {
    this.cards$ = this.workspaceService.getCards$();
  }
}
