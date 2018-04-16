import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserServiceProvider } from '../../providers/user-service/user-service';

/**
 * Generated class for the NewAddressPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-address',
  templateUrl: 'new-address.html',
})
export class NewAddressPage {

  firstname:string = "";
  lastname:string = "";
  phone:string = "";
  street1:string = "";
  street2:string = "";
  city:string = "";
  province:string = "";
  postalCode:string = "";

  isDefaultShipping:boolean = false;
  isDefaultBilling:boolean = false;

  showDefaultShipping:boolean = false;
  showDefaultBilling:boolean = false;

  customerInfo:any;
  addressList:any = [];
  addressIndex:number;
  isNewAddress:boolean;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    public userService: UserServiceProvider,
    private storage: Storage) {

      this.customerInfo = this.navParams.get('customerInfo');
      this.addressList = this.navParams.get('addressList');
      this.addressIndex = this.navParams.get('addressIndex');
      this.isNewAddress = this.navParams.get('isNew');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewAddressPage');
    
    if (!this.isNewAddress) {
      this.firstname = this.addressList[this.addressIndex].firstname;
      this.lastname = this.addressList[this.addressIndex].lastname;
      this.phone = this.addressList[this.addressIndex].telephone;
      this.street1 = this.addressList[this.addressIndex].street[0];

      if (this.addressList[this.addressIndex].street.length > 1) {
        this.street2 = this.addressList[this.addressIndex].street[1];
      }

      this.city = this.addressList[this.addressIndex].city;
      this.province = this.addressList[this.addressIndex].region.region;
      this.postalCode = this.addressList[this.addressIndex].postcode;

      this.isDefaultShipping = Boolean(this.addressList[this.addressIndex].default_shipping);
      this.isDefaultBilling = Boolean(this.addressList[this.addressIndex].default_billing);
      this.showDefaultShipping = Boolean(this.addressList[this.addressIndex].default_shipping);
      this.showDefaultBilling = Boolean(this.addressList[this.addressIndex].default_billing);
    }
  }

  /* Action */
  saveAddressTapped() {
    if (this.firstname == "") {
      this.presentToast('Please fill in your first name');
    }
    else if (this.lastname == "") {
      this.presentToast('Please fill in your last name');
    }
    else if (this.phone == "") {
      this.presentToast('Please fill in your phone number');
    }
    else if (this.street1 == "") {
      this.presentToast('Please fill in your street address');
    }
    else if (this.city == "") {
      this.presentToast('Please fill in your city');
    }
    else if (this.province == "") {
      this.presentToast('Please fill in your province');
    }
    else if (this.postalCode == "") {
      this.presentToast('Please fill in your postal code');
    }
    else {
      if (this.isNewAddress) {
        this.sendNewAddress();
      }
      else {
        this.sendUpdateAddress();
      }
    }
  }
  
  sendNewAddress() {
    //Cannot use existing template, whatif this is the first address
    var address:any;
    var streetList:any = [];

    streetList.push(this.street1);
    if (this.street2 != "") {
      streetList.push(this.street2);
    } 

    address = {
      "region": {
          "region_code": this.province,
          "region": this.province,
          "region_id": 0
      },
      "region_id": 0,
      "country_id": "IN",
      "street": streetList,
      "telephone": this.phone,
      "postcode": this.postalCode,
      "city": this.city,
      "firstname": this.firstname,
      "lastname": this.lastname,

      "default_shipping": this.isDefaultShipping,
      "default_billing": this.isDefaultBilling
    }

    this.addressList.push(address);

    this.userService.updateAddress(this.customerInfo.email, this.customerInfo.firstname, this.customerInfo.lastname, this.addressList).then(data => {
      //console.log(data);
      this.presentAlert("Success", "Your address has been added");
      this.navCtrl.pop();

    }).catch(error => { });
  }

  sendUpdateAddress() {

    this.addressList[this.addressIndex].firstname = this.firstname;
    this.addressList[this.addressIndex].lastname = this.lastname;
    this.addressList[this.addressIndex].telephone = this.phone;

    var streetList:any = [];
    streetList.push(this.street1);
    if (this.street2 != "") {
      streetList.push(this.street2);
    } 

    this.addressList[this.addressIndex].street = streetList;
    this.addressList[this.addressIndex].city = this.city;
    this.addressList[this.addressIndex].region.region = this.province;
    this.addressList[this.addressIndex].postcode = this.postalCode;

    this.addressList[this.addressIndex].default_shipping = this.isDefaultShipping;
    this.addressList[this.addressIndex].default_billing = this.isDefaultBilling;

    this.userService.updateAddress(this.customerInfo.email, this.customerInfo.firstname, this.customerInfo.lastname, this.addressList).then(data => {
      //console.log(data);
      this.presentAlert("Success", "Your address has been updated.");
      this.navCtrl.pop();

    }).catch(error => { });
  }

  /* Alert */
  presentAlert(title: any, text: any) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['Okay']
    });
    alert.present();
  }

  presentToast(text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'bottom'
    });
    toast.present();
  }
}
