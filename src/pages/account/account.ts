import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { UserServiceProvider } from '../../providers/user-service/user-service';
import { MySharedServiceProvider } from '../../providers/my-shared-service/my-shared-service';
import { OrderListPage } from '../order-list/order-list';
import { WishlistPage } from '../wishlist/wishlist';
import { AddressListPage } from '../address-list/address-list';
import { PaymentListPage } from '../payment-list/payment-list';
import { ProfilePage } from '../profile/profile';
import { LoginPage } from '../login/login';
/**
 * Generated class for the AccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  providers: [UserServiceProvider]
})
export class AccountPage {

  orderListPage = OrderListPage;
  wishlistPage = WishlistPage;
  addressListPage = AddressListPage;
  paymentListPage = PaymentListPage;
  profilePage = ProfilePage;
  loginPage = LoginPage;

  optionList: any = [];
  titleList: any = [];
  iconList: any = [];

  isLogin:boolean = false;
  //privateToken:string;
  email:string;
  firstname:string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private alertCtrl: AlertController,
    public userService: UserServiceProvider,
    public sharedService: MySharedServiceProvider,
    private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
  }

  ionViewWillEnter() {
    this.checkLogin();
  }

  checkLogin() {
    this.storage.get('privateToken').then((val) => {
      if (val) {
        this.isLogin = true;
        this.getAccount();
      }
      else {
        this.isLogin = false;
      }
    });
  }

  getAccount() {
    this.userService.getAccount().then(data => {
      var localData:any = data;
      this.email = localData.email;
      this.firstname = localData.firstname;
    }).catch(error => { });
  }

  goToLogin() {
    this.navCtrl.push(this.loginPage, {});
  }

  signOut() {
    this.storage.remove('privateToken');
    this.sharedService.privateToken = "";

    this.isLogin = false;
    this.email = "";
    this.firstname = "";
  }

  /* Alert */
  presentSignOut() {
    let alert = this.alertCtrl.create({
      title: 'Logging Out',
      message: 'Are you sure you want to sign out?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Confirm',
          handler: () => {
            this.signOut();
          }
        }
      ]
    });
    alert.present();
  }

  /* Actions */
  orderTapped() {
    if (!this.isLogin) {
      this.goToLogin();
    }
    else {
      this.navCtrl.push(this.orderListPage, {});
    }
  }

  addressTapped() {
    if (!this.isLogin) {
      this.goToLogin();
    }
    else {
      this.navCtrl.push(this.addressListPage, {});
    }
  }
 
  profileTapped() {
    if (!this.isLogin) {
      this.goToLogin();
    }
    else {
      this.navCtrl.push(this.profilePage, {});
    }
  }

  signOutTapped() {
    this.presentSignOut();
  }

  // Need API
  /*
  wishlistTapped() {
    if (!this.isLogin) {
      this.goToLogin();
    }
    else {
      this.navCtrl.push(this.wishlistPage, {});
    }
  }
  */

  /*
  paymentTapped() {
    if (!this.isLogin) {
      this.goToLogin();
    }
    else {
      this.navCtrl.push(this.paymentListPage, {});
    }
  }
  */
}
