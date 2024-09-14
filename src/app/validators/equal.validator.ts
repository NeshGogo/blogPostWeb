import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function equal(controlNameToMatch: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const controls = control.parent?.controls as any;
    const value1 = control.value;
    const value2 = controls? controls[controlNameToMatch]?.value : null;

    if (!value1 || !value2) return null;

    const areEqual = value1 === value2;

    return !areEqual ? { notMatch: true } : null;
  };
}
