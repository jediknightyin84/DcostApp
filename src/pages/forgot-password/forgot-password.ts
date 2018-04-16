import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

  email:string = "";

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public userService: UserServiceProvider,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ForgotPasswordPage');
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

  sendEmailTapped() {

    if (this.email == "") {
      this.presentToast('Email can not be blank');
      return;
    }

    this.userService.forgotPassword(this.email).then(data => {
      //console.log(data);
      this.presentAlert("Message", "An email has been sent");
      this.navCtrl.pop();
    }).catch(error => { });

  }
}
