import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { LoveformService } from 'src/app/services/loveform.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;
  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];



  constructor(private formBuilder: FormBuilder,
    private loveForm: LoveformService) {

  }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group(
      {
        customer: this.formBuilder.group(
          {
            firstName: new FormControl('',
              [Validators.required,
              Validators.minLength(2),
              ShopValidators.notOnlyWhiteSpaces]),

            lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),

            email: new FormControl('',
              [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]
            )
          }
        ),

        shippingAddress: this.formBuilder.group({
          street: new FormControl('', [Validators.required, Validators.minLength(2),Validators.minLength(2), ShopValidators.notOnlyWhiteSpaces]),
         
          city: new FormControl('', [Validators.required, Validators.minLength(2),
          ShopValidators.notOnlyWhiteSpaces]),
          state: new FormControl('', [Validators.required]),
          country: new FormControl('', [Validators.required]),
          zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
          ShopValidators.notOnlyWhiteSpaces])
        }),
        billingAddress: this.formBuilder.group(
          {
            street: new FormControl('', [Validators.required, Validators.minLength(2),Validators.minLength(2), ShopValidators.notOnlyWhiteSpaces]),
            city : new FormControl('', [Validators.required, Validators.minLength(2),
              ShopValidators.notOnlyWhiteSpaces]),
              state: new FormControl('', [Validators.required]),
              country: new FormControl('', [Validators.required]),
              zipCode: new FormControl('', [Validators.required, Validators.minLength(2),
              ShopValidators.notOnlyWhiteSpaces])
            }),
        creditCard: this.formBuilder.group(
          {
            cardType: [''],
            nameOnCard: [''],
            cardNumber: [''],
            securityCode: [''],
            expirationMonth: [''],
            expirationYear: ['']
          }
        )
      });

    //populate credit cart months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("start Mont " + startMonth);
    this.loveForm.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months:" + JSON.stringify(data));
        this.creditCardMonths = data;
      }

    );


    //populate credit cart years
    this.loveForm.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card months:" + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    //populate countries
    this.loveForm.getCountries().subscribe(
      data => {
        console.log("retrieved countries :" + JSON.stringify(data));
        this.countries = data;
      }
    );


  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country'); }






  onSubmit() {
    console.log('Handling the submit button');
    console.log(this.checkoutFormGroup.get('customer')!.value);
    if (this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }

  }
  copyShippingAddresToBilling(event: { target: any; }) {
    if (event.target) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.
        controls['shippingAddress'].value);
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();
      this.billingAddressStates = [];

    }



  }
  handleMonthsAndYears() {
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    const currentYear = new Date().getFullYear();
    const selectedYear = Number(creditCardFormGroup!.value.expirationYear);
    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    } else {
      startMonth = 1;
    }

    this.loveForm.getCreditCardMonths(startMonth).subscribe(
      data => {
        this.creditCardMonths = data;

      }
    )

  }
  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup!.value.country.code;
    const countryName = formGroup!.value.country.name;
    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);
    this.loveForm.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
        }
        else {
          this.billingAddressStates = data;
        }

        formGroup?.get('state')?.setValue(data[0]);
      }


    )
  }


}
