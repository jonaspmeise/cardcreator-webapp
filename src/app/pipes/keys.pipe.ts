import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform = (values: any[] | null): any[] => {
    if(!values) return [];

    return Object.keys(values[0]);
  }
}
