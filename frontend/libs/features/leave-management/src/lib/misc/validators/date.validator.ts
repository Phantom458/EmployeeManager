import {AbstractControl, ValidatorFn} from "@angular/forms";

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
