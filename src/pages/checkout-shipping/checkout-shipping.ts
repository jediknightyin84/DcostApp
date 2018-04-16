import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserServiceProvider } from '../../providers/user-service/user-service';
import { ShoppingCartServiceProvider } from '../../providers/shopping-cart-service/shopping-cart-service';

import { CheckoutPage } from '../checkout/checkout';
import { CheckoutAddressPage } from '../checkout-address/checkout-address';
/**
 * Generated class for the CheckoutShippingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout-shipping',
  templateUrl: 'checkout-shipping.html',
})
export class CheckoutShippingPage {

  checkoutPage = CheckoutPage;
  checkoutAddressPage = CheckoutAddressPage;

  customer:any;
  addressList:any = [];
  estimationList:any = [];

  selectedShipping:any;
  selectedID:string = "";

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public userService: UserServiceProvider,
    public shoppingService:ShoppingCartServiceProvider,
    private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutShippingPage');
    this.getAccount();
  }

  getAccount() {
    this.userService.getAccount().then(data => {
      console.log(data);

      var customerInfo:any = data;
      this.customer = data;

      this.addressList = customerInfo.addresses;

      if (this.selectedID == "") {
        for (var i = 0; i < this.addressList.length; i++) {
          if (this.addressList[i].default_shipping == true) {
            this.selectedShipping = this.addressList[i];
            this.selectedID = this.addressList[i].id;
            break;
          }
        }
  
        if (!this.selectedShipping) {
          if (this.addressList[i].length > 0) {
            this.selectedShipping = this.addressList[0];
            this.selectedID = this.addressList[i].id;
          }
        }
      }
      else {
        for (i = 0; i < this.addressList.length; i++) {
          if (this.addressList[i].id == this.selectedID) {
            this.selectedShipping = this.addressList[i];
          }
        }
      }

      if (this.selectedShipping) {
        this.getShippingEstimation(this.selectedShipping);
      }

    }).catch(error => {
      //this.presentToast("Credential Incorrect");
    });
  }

  getShippingEstimation(address:any) {

    let body = {  
      "address": {
        "region": address.region.region,
        "region_id": address.region.region_id,
        "region_code": address.region.region_code,
        "country_id": address.country_id,
        "street": address.street,
        "postcode": address.postcode,
        "city": address.city,
        "firstname": address.firstname,
        "lastname": address.lastname,
        "telephone": address.telephone,
        "customer_id": this.customer.id,
        "email": this.customer.email,
        "same_as_billing": 0
      }
    };

    this.shoppingService.getShippingEstimation(body).then(data => {
      //console.log(data);
      this.estimationList = data;

      for (var i = 0; i < this.estimationList.length; i++) {
        this.estimationList[i].selected = false;

        if (i == 0) {
          this.estimationList[i].selected = true;
        }
      }
    });
  }

  addressTapped() {
    this.navCtrl.push(this.checkoutAddressPage, {
      id: this.selectedID,
      callback: this.myCallbackFunction
    });
  }

  myCallbackFunction = (_params) => {
    return new Promise((resolve, reject) => {
      this.selectedID = _params.id;

      this.getAccount();
      resolve();
    });
  }

  paymentTapped() {
    var delivery:any;

    for (var i = 0; i < this.estimationList.length; i++) {
      if (this.estimationList[i].selected) {
        delivery = this.estimationList[i];
        break;
      }
    }

    this.navCtrl.push(this.checkoutPage, {
      shipping: this.selectedShipping,
      delivery: delivery
    });
  }
}
