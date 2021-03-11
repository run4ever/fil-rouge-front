import { stringify } from '@angular/compiler/src/util';
import { Pipe, PipeTransform } from '@angular/core';

//commande creation pipe : ng g pipe nompipe (à partir du repertoire souhaité)

@Pipe({
  name: 'delunderscore'
})
export class DelunderscorePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
   value = value.replace('_',' ');
   value = value.toLowerCase();
   value = value.charAt(0).toUpperCase() + value.slice(1);
   return value;
  }

}
