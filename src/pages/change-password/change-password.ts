import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserServiceProvider } from '../../providers/user-service/user-service';
/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  oldPassword:string = "";
  newPassword:string = "";
  confirmPassword:string = "";

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public userService: UserServiceProvider,
    private storage: Storage,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
  }

  presentToast(text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }

  presentAlert(title: any, text: any) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['Okay']
    });
    alert.present();
  }

  checkPassword() {
    //
    if (this.oldPassword == "" || this.newPassword == "" || this.confirmPassword == "") {
      this.presentToast('Password can not be blank');
      return false;
    } 

    //
    if (this.newPassword != this.confirmPassword) {
      this.presentToast('New passwords do not match');
      return false;
    }

    //
    if (this.newPassword.length < 8) {
      this.presentToast('New password is too short');
      return false;
    }
    else if (this.newPassword.length > 20) {
      this.presentToast('New password is too long');
      return false;
    }

    if (!this.newPassword.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])")) {
      this.presentToast("Include Digits, Lower Case and Upper Case in your new password");
      return false;
    }

    return true;
  }

  sendChangePassword() {
    this.userService.changePassword(this.oldPassword, this.newPassword).then(data => {
      if (Boolean(data)) {
        this.presentAlert("Success", "Password has been changed");
        this.navCtrl.pop();
      }
    }).catch(error => {
      this.presentAlert("Whoops", "Password is incorrect");
    });
  }

  saveChangeTapped() {
    if (this.checkPassword()) {
      this.sendChangePassword();
    }
  }
}
