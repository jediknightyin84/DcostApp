import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { NewPaymentPage } from '../new-payment/new-payment';
/**
 * Generated class for the PaymentListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-payment-list',
  templateUrl: 'payment-list.html',
})
export class PaymentListPage {

  newPaymentPage = NewPaymentPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentListPage');
  }

  goToPayment() {
    this.navCtrl.push(this.newPaymentPage, {});
  }

}
