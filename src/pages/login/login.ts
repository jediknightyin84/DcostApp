import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserServiceProvider } from '../../providers/user-service/user-service';
import { MySharedServiceProvider } from '../../providers/my-shared-service/my-shared-service';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  forgotPasswordPage = ForgotPasswordPage;

  mode:any;

  loginEmail:string = "";
  loginPassword:string = "";

  signupFirstname:string = "";
  signupLastname:string = "";
  signupEmail:string = "";
  signupPassword:string = "";
  signupConfirmPassword:string = "";

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public userService: UserServiceProvider,
    public sharedService: MySharedServiceProvider,
    private storage: Storage, 
    private toastCtrl: ToastController,
    private alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
    this.mode = 'login';
  }

  /* Alert */
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

  /* Check Account */
  checkAccount(isLogin:boolean, email:string) {
    this.userService.checkExistingAccount(email).then(data => {
      console.log(data);
      //console.log(Boolean(data));

      var isNewAccount = Boolean(data);
      // exists = false // nonexist = true

      if (isLogin) {
        if (!isNewAccount) {
          this.sendLogin(this.loginEmail, this.loginPassword);
        }
        else {
          this.presentToast("Account does not exist");
        }
      }
      else {
        if (!isNewAccount) {
          this.presentToast("Account already exists");
        }
        else {
          this.sendSignup();
        }
      }
    }).catch(error => {
      this.presentToast("Credential Incorrect");
    });
  }

  /* Check Password */
  checkPassword(password:string, confirmPassword:string) {

    if (this.signupFirstname == "") {
      this.presentToast('First name can not be blank');
      return false;
    }
    else if (this.signupLastname == "") {
      this.presentToast('Last name can not be blank');
      return false;
    }
    else if (this.signupEmail == "") {
      this.presentToast('Email can not be blank');
      return false;
    }

    if (password == "" || confirmPassword == "") {
      this.presentToast('Password can not be blank');
      return false;
    } 

    //
    if (password != confirmPassword) {
      this.presentToast('Passwords do not match');
      return false;
    }

    //
    if (password.length < 8) {
      this.presentToast('Password is too short');
      return false;
    }
    else if (password.length > 20) {
      this.presentToast('Password is too long');
      return false;
    }

    if (!password.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])")) {
      this.presentToast("Include Digits, Lower Case and Upper Case in your password");
      return false;
    }

    return true;
  }

  sendLogin(email:string, password:string) {
    this.userService.generatePrivateToken(email, password).then(data => {
      //console.log(data);
      this.storage.set('privateToken', data);
      this.sharedService.privateToken = String(data);
      
      this.navCtrl.pop();
    }).catch(error => {
      this.presentToast("Credential Incorrect");
    });
  }

  sendSignup() {
    this.userService.createAccount(this.signupFirstname,this.signupLastname,this.signupEmail,this.signupPassword).then(data => {
      //console.log(data);
      this.sendLogin(this.signupEmail,this.signupPassword);
    }).catch(error => {
      this.presentToast("Signup Error");
    });
  }

  /* Actions */
  loginTapped() {
    if (this.loginEmail == "" || this.loginPassword == "") {
      this.presentToast('Login credentials can not be blank');
      return;
    }

    this.checkAccount(true, this.loginEmail);
  }

  forgotPasswordTapped() {
    this.navCtrl.push(this.forgotPasswordPage, {});
  }

  signupTapped() {
    if (this.checkPassword(this.signupPassword, this.signupConfirmPassword)) {
      this.checkAccount(false, this.signupEmail);
    }
  }
}
