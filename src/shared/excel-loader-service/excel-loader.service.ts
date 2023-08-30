import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelLoaderService {
  load = (content: Uint8Array): any[] => {
    const workbook = XLSX.read(content, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: true, skipHidden: true});

    const header: string[] = jsonData.splice(0, 1)[0];

    return jsonData
      .filter((row: any[]) => row.length > 0)
      .map((row: any[]) => {
        const obj: any = {};
        
        for (let i = 0; i < jsonData[0].length; i++) {
          obj[header[i]] = row[i];
        }
        console.log(obj);

        return obj;
      });
  };
}
