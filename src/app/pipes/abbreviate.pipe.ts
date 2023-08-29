import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abbreviate',
})
export class AbbreviatePipe implements PipeTransform {
  transform(value: string, maxLength: number = 10): string {
    if (value.length <= maxLength) {
      return value;
    } else {
      return value.substr(0, maxLength) + '...';
    }
  }
}