import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FiletypeConverterService {

  constructor() { }

  getContent = (file: File): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
  
      reader.onload = (event: any) => {
        const content = event.target.result;
        resolve(content);
      };
  
      reader.onerror = (event) => {
        reject(event.target!.error);
      };
  
      switch (this.getFileExtension(file).toLowerCase()) {
        case 'txt':
        case 'json':
        case 'csv':
          reader.readAsText(file);
          break;
        default:
          reader.readAsDataURL(file);
          break;
      }
    });
  }

  private getFileExtension = (file: File): string => {
    const fileNameParts = file.name.split('.');

    if (fileNameParts.length > 1) {
      return fileNameParts.pop()!.toLowerCase();
    }

    return '';
  }
}
