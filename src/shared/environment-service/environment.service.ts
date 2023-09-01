import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoadedFile } from 'src/model/LoadedFile';
import { FiletypeConverterService } from '../filetype-converter-service/filetype-converter.service';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private environmentVariablesSubject = new BehaviorSubject(new Map<string, string>());
  private filesSubject = new BehaviorSubject<LoadedFile[]>([]);

  environmentVariables$ = this.environmentVariablesSubject.asObservable();
  files$ = this.filesSubject.asObservable();

  constructor(private fileTypeConverterService: FiletypeConverterService) {
    this.environmentVariablesSubject.getValue().set('ExampleKey', 'This value can be referenced by using a (environment) => {...} function!');
    this.environmentVariablesSubject.getValue().set('','');
  }
  
  private setStandardEnvironmentValue() {
    this.environmentVariablesSubject.getValue().set('', '');
  }
  
  changeEnvironmentKey = (oldKey: string, newKey: string) => {
    const map = this.environmentVariablesSubject.getValue();

    if(map.has(newKey)) throw Error('Duplicate Key!');

    map.delete(oldKey);
    map.set(newKey, map.get(oldKey) || '');

    this.setStandardEnvironmentValue();
  }

  changeEnvironmentValue = (key: string, newValue: string) => {
    const map = this.environmentVariablesSubject.getValue();

    map.set(key, newValue || '');

    this.setStandardEnvironmentValue();
  }

  addFile = (file: File, path?: string): void => {
    this.fileTypeConverterService.getContent(file).then(
      content => {
        const newFiles = [...this.filesSubject.getValue(), new LoadedFile(file, content, path)];

        console.log(newFiles);
    
        this.filesSubject.next(newFiles);
      }
    );
  }

  clearFiles = (): void => {
    this.filesSubject.next([]);
  }
}
