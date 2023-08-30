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

  constructor(private workspaceService: WorkspaceService) {}

  ngOnInit(): void {    
    this.workspaceService.cards$.subscribe(cards => {
      this.cards = cards;
    });
    
    this.selectedCard$ = this.workspaceService.selectedCard$;
  }

  onClick = (card: any) => {
    this.workspaceService.selectCard(card);
  }
}
