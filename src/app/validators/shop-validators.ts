import { FormControl, ValidationErrors } from "@angular/forms";

export class ShopValidators {
    //white space validators
    static notOnlyWhiteSpaces(control: FormControl): ValidationErrors {
        if ((control.value != null) && (control.value.trim().lenght === 0)) {
            //invalid, return error object
            return { 'notOnlyWhiteSpaces':  true};

        }else{
            return null!;
        }
        
    }
}
