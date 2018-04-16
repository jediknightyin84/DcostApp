import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the CheckoutPaymentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// TO DELETE LATER 
@IonicPage()
@Component({
  selector: 'page-checkout-payment',
  templateUrl: 'checkout-payment.html',
})
export class CheckoutPaymentPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPaymentPage');
  }

}
