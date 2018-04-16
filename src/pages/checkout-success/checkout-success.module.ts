import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckoutSuccessPage } from './checkout-success';

@NgModule({
  declarations: [
    CheckoutSuccessPage,
  ],
  imports: [
    IonicPageModule.forChild(CheckoutSuccessPage),
  ],
})
export class CheckoutSuccessPageModule {}
