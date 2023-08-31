import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { WorkspaceService } from 'src/shared/workspace-service/workspace.service';

@Component({
  selector: 'app-card-sheet',
  templateUrl: './card-sheet.component.html',
  styleUrls: ['./card-sheet.component.css']
})
export class CardSheetComponent implements OnInit {
  cards!: any[];
  selectedCard$!: Observable<any>;
  availableSheets$!: Observable<string[]>;
  currentSheet$!: Observable<string | null>;

  constructor(private workspaceService: WorkspaceService) {}

  ngOnInit(): void {    
    this.workspaceService.cards$.subscribe(cards => {
      this.cards = cards;
    });
    
    this.availableSheets$ = this.workspaceService.availableSheets$;
    this.currentSheet$ = this.workspaceService.currentSheet$;
    this.selectedCard$ = this.workspaceService.selectedCard$;
  }

  onClickCard = (card: any) => {
    this.workspaceService.selectCard(card);
  }

  onButtonClick = (sheet: string) => {
    this.workspaceService.switchSheet(sheet);
  }
}
