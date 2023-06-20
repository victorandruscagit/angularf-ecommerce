import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoveformService } from 'src/app/services/loveform.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutFormGroup!: FormGroup;
  totalPrice:number = 0;
  totalQuantity : number = 0;
  creditCardYears : number[] = [];
  creditCardMonths : number[] = [];


  constructor(private formBuilder: FormBuilder,
              private loveForm : LoveformService) {

  }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group(
      {
        customer: this.formBuilder.group(
          {
            firstName: [''],
            lastName: [''],
            email: ['']
          }
        ),

        shippingAddress: this.formBuilder.group(
          {
            street: [''],
            city: [''],
            state: [''],
            country: [''],
            zipCode: ['']
          }
        ),
        billingAddress: this.formBuilder.group(
          {
            street: [''],
            city: [''],
            state: [''],
            country: [''],
            zipCode: ['']
          }
        ),
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
      const startMonth : number = new Date().getMonth() + 1;
      console.log("start Mont " + startMonth);
      this.loveForm.getCreditCardMonths(startMonth).subscribe(
        data =>{
          console.log("Retrieved credit card months:" + JSON.stringify(data));
          this.creditCardMonths = data;
        }
      );

       
      //populate credit cart year
      this.loveForm.getCreditCardYears().subscribe(
        data =>{
          console.log("Retrieved credit card months:" + JSON.stringify(data));
          this.creditCardYears = data;
        }
      );



  }

  onSubmit() {
    console.log('Handling the submit button');
    console.log(this.checkoutFormGroup.get('customer')!.value);

  }
  copyShippingAddresToBilling(event: { target: any; }) {
    if (event.target) {
      this.checkoutFormGroup.controls['billingAddress'].setValue(this.checkoutFormGroup.
        controls['shippingAddress'].value);
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

    }

  }
}
