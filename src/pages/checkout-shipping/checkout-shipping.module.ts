import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckoutShippingPage } from './checkout-shipping';

@NgModule({
  declarations: [
    CheckoutShippingPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckoutShippingPage),
  ],
})
export class CheckoutShippingPageModule {}
