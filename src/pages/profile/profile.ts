import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { ChangeNamePage } from '../change-name/change-name'
import { ChangePasswordPage } from '../change-password/change-password'

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  changeNamePage = ChangeNamePage;
  changePasswordPage = ChangePasswordPage;

  firstname:string;
  lastname:string;
  email:string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public userService: UserServiceProvider,
    private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    //this.getAccount();
  }

  getAccount() {
    this.userService.getAccount().then(data => {
      var customerInfo:any = data;
      this.email = customerInfo.email;
      this.firstname = customerInfo.firstname;
      this.lastname = customerInfo.lastname;    
    }).catch(error => { });
  }

  nameTapped() {
    this.navCtrl.push(this.changeNamePage, {});
  }

  emailTapped() {

  }

  passwordTapped() {
    this.navCtrl.push(this.changePasswordPage, {});
  }
}
