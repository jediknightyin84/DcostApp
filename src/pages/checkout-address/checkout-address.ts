import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { NewAddressPage } from '../new-address/new-address';
/**
 * Generated class for the CheckoutAddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-checkout-address',
  templateUrl: 'checkout-address.html',
})
export class CheckoutAddressPage {

  newAddressPage = NewAddressPage;

  callback:any;
  customerInfo:any;
  addressList:any = [];
  selectedID:string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public userService: UserServiceProvider,
    private storage: Storage) {
      this.selectedID = this.navParams.get("id");
      this.callback = this.navParams.get("callback");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CheckoutAddressPage');
    this.getAccount();
  }

  getAccount() {
    this.userService.getAccount().then(data => {
      //console.log(data);

      var customerInfo:any = data;
      this.customerInfo = data;
      this.addressList = customerInfo.addresses;

      for (var i = 0; i < this.addressList.length; i++) {
        this.addressList[i].selected = false;
        if (this.addressList[i].id == this.selectedID) {
          this.addressList[i].selected = true;
        }
      }
    }).catch(error => {
      //this.presentToast("Credential Incorrect");
    });
  }

  newTapped() {
    this.navCtrl.push(this.newAddressPage, {
      customerInfo: this.customerInfo,
      addressList: this.addressList,
      addressIndex: 0,
      isNew: true
    });
  }

  selectTapped(index: number) {
    for (var i = 0; i < this.addressList.length; i++) {
      this.addressList[i].selected = false;
    }
    this.addressList[index].selected = true;
    this.selectedID = this.addressList[index].id;
  }

  confirmTapped() {
    //this.navCtrl.pop()
    var param:any = {
      id: this.selectedID
    }

    this.callback(param).then(()=>{
      this.navCtrl.pop();
    });
  }
}
