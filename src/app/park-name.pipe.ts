import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'parkName'
})
export class ParkNamePipe implements PipeTransform {

  transform(values: Array<any>, args:any[]):any {
    return values.filter((value) => {
          if (!args[0][0].length) {
            return true;
          }
          if (!value.attributes.NAME.toLowerCase().includes(args[0][0].toLowerCase())) {
              return false;
          }
        return true;
    });
}
}
