import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserServiceProvider } from '../../providers/user-service/user-service';

/**
 * Generated class for the ChangeNamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-name',
  templateUrl: 'change-name.html',
})
export class ChangeNamePage {

  firstname:string = "";
  lastname:string = "";
  email:string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    public userService: UserServiceProvider,
    private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangeNamePage');
    this.getAccount();
  }

  getAccount() {
    this.userService.getAccount().then(data => {
      //console.log(data);

      var customerInfo:any = data;
      this.email = customerInfo.email;
      this.firstname = customerInfo.firstname;
      this.lastname = customerInfo.lastname;
      
    }).catch(error => { });
  }

  presentToast(text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
    //toast.onDidDismiss(() => {
    //  console.log('Dismissed toast');
    //});
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

  sendChangeName() {
    this.userService.changeCustomerName(this.firstname, this.lastname, this.email).then(data => {
      this.presentAlert("Success", "Your name has been changed");
      this.navCtrl.pop();
    }).catch(error => { });
  }

  saveChangeTapped() {
    if (this.firstname == "" || this.lastname == "") {
      this.presentToast("Name can not be blank");
    }
    else {
      this.sendChangeName();
    }
  }
}
