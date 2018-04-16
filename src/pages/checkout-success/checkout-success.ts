import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Tabs } from 'ionic-angular';

/**
 * Generated class for the CheckoutSuccessPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout-success',
  templateUrl: 'checkout-success.html',
})
export class CheckoutSuccessPage {

  tab:Tabs;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.tab = this.navCtrl.parent; 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutSuccessPage');
  }

  shopMoreTapped() {
    this.navCtrl.popToRoot();
    this.tab.select(0);
  }
}
