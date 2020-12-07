import {AbstractControl, ValidatorFn} from "@angular/forms";

// export function dateValidator(control: AbstractControl): { [key: string]: boolean } | null {
//   let startDate = control.get('startDate').value;
//   let endDate = control.get('endDate').value;
//   startDate = startDate.split('-');
//   endDate = endDate.split('-');
//   return (startDate !== null && endDate !== null)
//         && startDate[0]>endDate[0] && startDate[1]>endDate[1]
//         && (startDate[1]=endDate[1] && startDate[2]>endDate[2])?
//         {'invalidDate': true} : null;
// }

// export function DateValidator(control: AbstractControl): { [key: string]: boolean } | null {
//   let startDate = control.get('startDate').value;
//   let endDate = control.get('endDate').value;
//   if ((startDate !== null && endDate !== null) && startDate > endDate) {
//     return {'invalidDate': true};
//   }
//   return null;
// }

export class DateValidators {
  static validRange(date1: string, date2: string, validatorField: { [key: string]: boolean }): ValidatorFn {
    return (c: AbstractControl): { [key: string]: boolean } | null => {
      const startDate = c.get(date1).value;
      const endDate = c.get(date2).value;
      if ((startDate !== null && endDate !== null) && startDate > endDate) {
        return validatorField;
      }
      return null;
    };
  }
}
