import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  render = (svgBase64: string, filename: string): Promise<{blob: Blob | null, filename: string}> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
    
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx!.drawImage(img, 0, 0);

        console.log('Image link', canvas.toDataURL("image/png"));

        canvas.toBlob((blob) => resolve({blob: blob, filename: filename}), "image/png");
      };

      img.src = svgBase64;
    });
  };
}
