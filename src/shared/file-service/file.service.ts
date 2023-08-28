import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { FileKeyValue } from 'src/model/FileKeyValue';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private files: FileKeyValue[] = [];
  private filesSubject = new Subject<FileKeyValue[]>();

  files$: Observable<FileKeyValue[]> = this.filesSubject.asObservable();

  add(file: FileKeyValue): void {
    this.files.push(file);
    this.filesSubject.next(this.files);
  }

  clearFiles() {
    this.files = [];
    this.filesSubject.next(this.files);
  }
}
