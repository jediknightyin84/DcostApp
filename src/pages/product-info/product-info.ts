import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { ProductServiceProvider } from '../../providers/product-service/product-service';

/**
 * Generated class for the ProductInfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-info',
  templateUrl: 'product-info.html',
})
export class ProductInfoPage {

  product:any = {};
  description:string;

  //sizes = [];
  //colors = [];

  sku:string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public productService: ProductServiceProvider) {
      this.sku = this.navParams.get('sku');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductInfoPage');

    this.getProductDetail();
  }

  getProductDetail() {
    this.productService.getProductDetail(this.sku).then(data => {
      this.product = data;

      for (var i = 0; i < this.product.custom_attributes.length; i++) {
        //console.log(this.product.custom_attributes[i]);
        if (this.product.custom_attributes[i].attribute_code == 'description') {
          this.description = this.product.custom_attributes[i].value;
        }
      }
    });
  }

  closeTapped() {
    this.navCtrl.pop();
  }

  shareTapped() {

  }

  wishlistTapped() {
    
  }
}
