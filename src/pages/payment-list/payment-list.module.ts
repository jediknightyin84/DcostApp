import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentListPage } from './payment-list';

@NgModule({
  declarations: [
    PaymentListPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentListPage),
  ],
})
export class PaymentListPageModule {}
