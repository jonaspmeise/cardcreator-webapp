import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FileSelectorComponent } from './file-selector/file-selector.component';
import { FileListComponent } from './file-list/file-list.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { AbbreviatePipe } from './pipes/abbreviate.pipe';
import { KeysPipe } from './pipes/keys.pipe';
import { ValuesPipe } from './pipes/values.pipe';
import { CardSheetComponent } from './card-sheet/card-sheet.component';

@NgModule({
  declarations: [
    AppComponent,
    FileSelectorComponent,
    FileListComponent,
    AbbreviatePipe,
    ValuesPipe,
    KeysPipe,
    CardSheetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgxFileDropModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
