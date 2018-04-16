import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ShoppingCartServiceProvider } from '../../providers/shopping-cart-service/shopping-cart-service';
import { ProductServiceProvider } from '../../providers/product-service/product-service';
import { UserServiceProvider } from '../../providers/user-service/user-service';

import { CheckoutSuccessPage } from '../checkout-success/checkout-success';
import { CheckoutAddressPage } from '../checkout-address/checkout-address';

import { Braintree, ApplePayOptions, PaymentUIOptions, PaymentUIResult } from '@ionic-native/braintree';

/**
 * Generated class for the CheckoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout',
  templateUrl: 'checkout.html',
})
export class CheckoutPage {

  checkoutAddressPage = CheckoutAddressPage;
  checkoutSuccessPage = CheckoutSuccessPage;

  baseURL:string = "http://ec2-35-154-79-111.ap-south-1.compute.amazonaws.com/dcost/pub/media/catalog/product";

  shipping:any;
  delivery:any;

  selectedBilling:any;
  selectedID:string = "";

  paymentList:any = [];
  productList:any = [];
  totalList:any = [];
  grandTotal:any;

  addressList:any = [];

  isCheckoutDisabled:boolean = false;

  //isPaypal:boolean = false;
  //savedNonce:string;
  //savedPaypal:any;

  BRAINTREE_TOKEN = 'sandbox_jb5zgbhh_388zmjgx6w278ykt';

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public productService:ProductServiceProvider,
    public shoppingService:ShoppingCartServiceProvider,
    public userService: UserServiceProvider,
    private storage: Storage,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private braintree: Braintree) {

    this.shipping = this.navParams.get('shipping');
    this.delivery = this.navParams.get('delivery');

    this.selectedBilling = this.shipping;
    this.selectedID = this.shipping.id;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutPage');

    this.getPaymentMethod();
    this.getAccount();
  }

  getAccount() {
    this.userService.getAccount().then(data => {
      var localData:any = data;
      this.addressList = localData.addresses;

      for (var i = 0; i < this.addressList.length; i++) {
        if (this.addressList[i].id == this.selectedID) {
          this.selectedBilling = this.addressList[i];
        }
      }
    }).catch(error => { });
  }

  getPaymentMethod() {
    let body = {  
      "addressInformation": {
        "shipping_address": {
          "region": this.shipping.region.region,
          "region_id": this.shipping.region.region_id,
          "region_code": this.shipping.region.region_code,
          "country_id": this.shipping.country_id,
          "street": this.shipping.street,
          "postcode": this.shipping.postcode,
          "city": this.shipping.city,
          "firstname": this.shipping.firstname,
          "lastname": this.shipping.lastname,
          "telephone": this.shipping.telephone,
        },
        "billing_address": {
          //"email": "jdoe@example.com",
          "region": this.selectedBilling.region.region,
          "region_id": this.selectedBilling.region.region_id,
          "region_code": this.selectedBilling.region.region_code,
          "country_id": this.selectedBilling.country_id,
          "street": this.selectedBilling.street,
          "postcode": this.selectedBilling.postcode,
          "city": this.selectedBilling.city,
          "firstname": this.selectedBilling.firstname,
          "lastname": this.selectedBilling.lastname,
          "telephone": this.selectedBilling.telephone,
        },
        "shipping_carrier_code": this.delivery.carrier_code,
        "shipping_method_code": this.delivery.method_code
      }
    };

    this.shoppingService.setShippingInformation(body).then(data => {
      console.log(data);

      var localData:any = data;
      this.paymentList = localData.payment_methods;

      for (var i = 0; i < this.paymentList.length; i++) {
        this.paymentList[i].selected = false;
        if (i == 0) {
          this.paymentList[i].selected = true;
        }
      }

      this.productList = localData.totals.items;
      this.totalList = localData.totals.total_segments;
      this.grandTotal = localData.totals.grand_total;

      this.getShoppingCart();
    });
  }

  getShoppingCart() {
    this.shoppingService.getCart().then(data => {
      //console.log(data);
      var localData:any = data;
      var cartList = localData.items;

      for (var i = 0; i < cartList.length; i++) {
        for (var j = 0; j < this.productList.length; j++) {
          if (cartList[i].item_id == this.productList[j].item_id) {
            this.productList[j].image = 'assets/imgs/PlaceholderSample.png';
            this.getProductDetail(j, cartList[i].sku);
            break;
          }
        }
      }
    }).catch(error => { });
  }

  getProductDetail(index:number, sku:string) {
    this.productService.getProductDetail(sku).then(data => {
      let product:any = data;

      for (var i = 0; i < product.custom_attributes.length; i++) {
        if (product.custom_attributes[i].attribute_code == "thumbnail") {
          this.productList[index].image = this.baseURL + product.custom_attributes[i].value;
          break;
        }
      }
    }).catch(error => { });
  }

  presentToast(text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });  
    toast.present();
  }

  payOffline(method:string) {
    var billing:any = {
      //"email": "jdoe@example.com",
      "region": this.selectedBilling.region.region,
      "region_id": this.selectedBilling.region.region_id,
      "region_code": this.selectedBilling.region.region_code,
      "country_id": this.selectedBilling.country_id,
      "street": this.selectedBilling.street,
      "postcode": this.selectedBilling.postcode,
      "city": this.selectedBilling.city,
      "telephone": this.selectedBilling.telephone,
      "firstname": this.selectedBilling.firstname,
      "lastname": this.selectedBilling.lastname
    }

    this.shoppingService.placeOrderOffline(method, billing).then(data => {
      //console.log(data);
      this.navCtrl.push(this.checkoutSuccessPage, {});
      this.isCheckoutDisabled = false;
    }).catch(error => { 
      this.isCheckoutDisabled = false;
    });
  }

  payOnline(method:string) {
    const paymentOptions: PaymentUIOptions = {
      amount: this.grandTotal,
      primaryDescription: 'Total Price',
    };

    //.then(() => this.braintree.setupApplePay(appleOptions))
    this.braintree.initialize(this.BRAINTREE_TOKEN)
    .then(() => this.braintree.presentDropInPaymentUI(paymentOptions))
    .then((result: PaymentUIResult) => {
    
      if (result.userCancelled) {
        console.log("User cancelled payment dialog.");
      } 
      else {
        console.log("User successfully completed payment!");
        console.log(paymentOptions.amount);
        console.log(paymentOptions.primaryDescription);
        console.log("Payment Nonce: " + result.nonce);

        if (result.type != "PayPal") {      
          var billing:any = {
            //"email": "jdoe@example.com",
            "region": this.selectedBilling.region.region,
            "region_id": this.selectedBilling.region.region_id,
            "region_code": this.selectedBilling.region.region_code,
            "country_id": this.selectedBilling.country_id,
            "street": this.selectedBilling.street,
            "postcode": this.selectedBilling.postcode,
            "city": this.selectedBilling.city,
            "telephone": this.selectedBilling.telephone,
            "firstname": this.selectedBilling.firstname,
            "lastname": this.selectedBilling.lastname
          }
          this.shoppingService.placeOrderOnline(method, billing, result.nonce).then(data => {
            //console.log(data);
            this.navCtrl.push(this.checkoutSuccessPage, {});
          });
        }
        //else {
          //this.isPaypal = true;
          //this.savedNonce = result.nonce;
          //this.savedPaypal = result.payPalAccount;
        //}
      }

      this.isCheckoutDisabled = false;
    }).catch(error => { 
      this.isCheckoutDisabled = false;
    });

    //.catch((error: string) => console.error(error));
  }

  /* Actions */
  paymentTapped(index: number) {

    if (!this.paymentList[index].selected) {
      //this.paymentList[index].selected = true;
    }
    else {
      for (var i = 0; i < this.paymentList.length; i++) {
        this.paymentList[i].selected = false;
      }
      this.paymentList[index].selected = true;
    }

    //console.log(this.paymentList);
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

  placeOrderTapped() {

    this.isCheckoutDisabled = true;

    var method:string = "";

    for (var i = 0; i < this.paymentList.length; i++) {
      if (this.paymentList[i].selected) {
        method = this.paymentList[i].code;
        break;
      }
    } 

    if (method == "") {
      this.presentToast('Please select a payment method');
      this.isCheckoutDisabled = false;
    }
    else if (method == "braintree") {
      this.payOnline(method);
    }
    else {
      this.payOffline(method);
    }

    //this.navCtrl.push(this.checkoutSuccessPage, {});
  }

  /*
  paypalTapped() {
    var method:string;

    for (var i = 0; i < this.paymentList.length; i++) {
      //if (this.paymentList[i].selected) {
        method = this.paymentList[i].code;
      //}
    } 

    var billing:any = {
      //"email": "jdoe@example.com",
      "region": this.selectedBilling.region.region,
      "region_id": this.selectedBilling.region.region_id,
      "region_code": this.selectedBilling.region.region_code,
      "country_id": this.selectedBilling.country_id,
      "street": this.selectedBilling.street,
      "postcode": this.selectedBilling.postcode,
      "city": this.selectedBilling.city,
      "telephone": this.selectedBilling.telephone,
      "firstname": this.selectedBilling.firstname,
      "lastname": this.selectedBilling.lastname
    }
    this.shoppingService.placeOrder(method, this.savedNonce, billing).then(data => {
      console.log(data);
      this.navCtrl.push(this.checkoutSuccessPage, {});
    }).catch((error: string) => console.error(error));
  }
  */

  /*
  presentAlert(title: any, text: any) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['Okay']
    });
    alert.present();
  }
  */
}
