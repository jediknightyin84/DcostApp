import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { NewAddressPage } from '../new-address/new-address';
/**
 * Generated class for the AddressListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-address-list',
  templateUrl: 'address-list.html',
})
export class AddressListPage {

  newAddressPage = NewAddressPage;

  customerInfo:any;
  addressList:any = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,     
    private alertCtrl: AlertController,
    public userService: UserServiceProvider,
    private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddressListPage');
  }

  ionViewWillEnter() {
    this.getAccount();
  }

  getAccount() {
    this.userService.getAccount().then(data => {
      var customerInfo:any = data;
      this.customerInfo = data;
      this.addressList = customerInfo.addresses;
    }).catch(error => { });
  }

  presentDeleteAddress(index:number) {
    let alert = this.alertCtrl.create({
      title: 'Warning!',
      message: 'Are you sure you want to delete this address?',
      buttons: [
        {
          text: 'Never mind',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes, delete it',
          handler: () => {
            this.deleteAddress(index);
          }
        }
      ]
    });
    alert.present();
  }

  deleteAddress(index:number) {
    this.addressList.splice(index, 1);
    this.userService.updateAddress(this.customerInfo.email, this.customerInfo.firstname, this.customerInfo.lastname, this.addressList).then(data => {
      //console.log(data);
      this.getAccount();
    }).catch(error => { });
  }

  deleteTapped(index:number) {
    this.presentDeleteAddress(index);
  }

  newTapped() {
    this.navCtrl.push(this.newAddressPage, {
      customerInfo: this.customerInfo,
      addressList: this.addressList,
      addressIndex: 0,
      isNew: true
    });
  }

  editTapped(index:number) {
    this.navCtrl.push(this.newAddressPage, {
      customerInfo: this.customerInfo,
      addressList: this.addressList,
      addressIndex: index,
      isNew: false
    });
  }
}
