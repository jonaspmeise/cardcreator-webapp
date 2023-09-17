import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { LoadedFile } from 'src/model/LoadedFile';
import { FiletypeConverterService } from '../filetype-converter-service/filetype-converter.service';
import { StringMappingType } from 'typescript';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {
  private environmentVariablesSubject = new BehaviorSubject(new Map<string, string>());
  private filesSubject = new BehaviorSubject<LoadedFile[]>([]);
  private environmentSubject = new BehaviorSubject(new Map<string, string>());

  environmentVariables$ = this.environmentVariablesSubject.asObservable();
  files$ = this.filesSubject.asObservable();
  environment$ = this.environmentSubject.asObservable();

  constructor(private fileTypeConverterService: FiletypeConverterService) {
    this.environmentVariablesSubject.getValue().set('ExampleKey', 'This value can be referenced by using a (environment) => {...} function!');
    this.environmentVariablesSubject.getValue().set('','');

    this.files$.subscribe((files) => {
      const map: Map<string, string> = new Map();

      [...this.environmentVariablesSubject.getValue().entries()].forEach(([key, value]) => {
        map.set(key, value);
      });
      files.forEach((file) => {
        map.set(file.path || '', file.content);
      });

      this.environmentSubject.next(map);
    });

    this.environmentVariables$.subscribe((environment) => {
      const map: Map<string, string> = new Map();

      [...environment.entries()].forEach(([key, value]) => {
        map.set(key, value);
      });
      this.filesSubject.getValue().forEach((file) => {
        map.set(file.path || '', file.content);
      });

      this.environmentSubject.next(map);
    })
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
    
        this.filesSubject.next(newFiles);
      }
    );
  };

  clearFiles = (): void => {
    this.filesSubject.next([]);
  }

  getEnvironmentVariables = (): Map<string, string> => {
    return this.environmentVariablesSubject.getValue();
  }

  //unfortunate design, but we need to be able to set the environment variables when we load the project settings
  setEnvironmentVariables = (environmentVariables: Map<string, string>): void => {
    console.log(environmentVariables);
    [...environmentVariables.entries()].forEach(([key, value]) => {
      this.changeEnvironmentKey('', key);
      this.changeEnvironmentValue(key, value);
    });
  }

  getFileContent = (path: string): any => {
    return this.environmentSubject.getValue().get(path);
  }
}
