import { Injectable } from '@angular/core';
import { FileType } from 'src/model/FileTypes';

@Injectable({
  providedIn: 'root'
})
export class FiletypeConverterService {
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
  
      switch (this.getFileType(file)) {
        case 'image':
          reader.readAsDataURL(file);
          break;
        case 'table':
          reader.readAsArrayBuffer(file);
          break;
        default:
          reader.readAsText(file);
          break;
      }
    });
  }

  getFileType = (file: File): FileType => {
    const fileNameParts = file.name.split('.');

    if (fileNameParts.length > 1) {
      switch(fileNameParts.pop()!.toLowerCase()) {
        case 'txt':
          return 'text';
        case 'json':
        case 'xlsx':
        case 'csv':
          return 'table';
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'bmp':
          return 'image';
      }
    }

    return 'other';
  }
}
