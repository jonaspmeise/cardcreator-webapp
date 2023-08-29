import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FileKeyValue } from 'src/model/FileKeyValue';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceService {
  private files: FileKeyValue[] = [];
  private cards: any[] = [];

  private filesSubject = new BehaviorSubject<FileKeyValue[]>([]);
  private cardsSubject = new BehaviorSubject<any[]>([{columnA: 'value1', columnB: 'value2'}]);

  addFile(file: FileKeyValue): void {
    this.files.push(file);
    this.filesSubject.next(this.files);
  }

  clearFiles() {
    this.files = [];
    this.filesSubject.next(this.files);
  }

  getFiles$ = (): Observable<FileKeyValue[]> => {
    return this.filesSubject.asObservable();
  }

  getCards$ = (): Observable<any[]> => {
    return this.cardsSubject.asObservable();
  }
}
