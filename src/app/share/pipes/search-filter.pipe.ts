import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(comingObjects: any, filterValue?: any): any {
    if (!comingObjects) return null;
    if (!filterValue) return comingObjects;
    
    filterValue = filterValue.toLowerCase();
    /* return comingObjects.filter((item) => {
      return JSON.stringify(item).toLowerCase().includes(filterValue);
    }); */
    let result:Array<any> = [] ;
    for(let i = 0; i < comingObjects.length; i++){
      if(JSON.stringify(comingObjects[i]).toLowerCase().indexOf(filterValue) > -1){
        result.push(comingObjects[i]) ;
      }
    }
    if(result.length > 0){
      return result ;
    }
    return [-1] ;
  }

}
