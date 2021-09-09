import { AbstractControl } from '@angular/forms';

export function AgeValidator(control: AbstractControl): { [key: string]: boolean } | null {
  // console.log('Validator',control);
  const date = getAge(control.value)
  if (date <= 12) {
    return { 'age': true };
  }
  return null; 
}
const getAge = (birthDate: string | number | Date) => Math.floor((new Date().getTime() - new Date(birthDate).getTime()) / 3.15576e+10)