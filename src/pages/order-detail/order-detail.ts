import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { UserServiceProvider } from '../../providers/user-service/user-service'; 
import { ProductServiceProvider } from '../../providers/product-service/product-service';
import { ProductDetailPage } from '../product-detail/product-detail'; 
/**
 * Generated class for the OrderDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-detail',
  templateUrl: 'order-detail.html',
})
export class OrderDetailPage {

  productDetailPage = ProductDetailPage;
  baseURL:string = "http://ec2-35-154-79-111.ap-south-1.compute.amazonaws.com/dcost/pub/media/catalog/product";

  orderID:string;
  order:any = {};
  productList:any = [];
  address:any = {};
  paymentMethod:string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public userService: UserServiceProvider,
    public productService: ProductServiceProvider) {

      this.orderID = this.navParams.get('orderID');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderDetailPage');
    this.getOrder();
  }

  getOrder() {
    this.userService.getOrder(this.orderID).then(data => {
      //console.log(data);

      this.order = data;

      this.address = this.order.extension_attributes.shipping_assignments[0].shipping.address;
      //console.log(this.order.extension_attributes.shipping_assignments[0].shipping.address);
      this.paymentMethod = this.order.payment.additional_information[0];

      for (var i = 0; i < this.order.items.length; i++) {
        if (this.order.items[i].product_type == "simple") {

          var product = this.order.items[i];
          product.image = 'assets/imgs/PlaceholderSample.png';

          this.productList.push(product);
          this.getProductDetail(product);

          product.configurableSKU = "";
          this.getConfigurableProduct(product);
        }
      }
    });
  }

  getProductDetail(product:any) {
    this.productService.getProductDetail(product.sku).then(data => {
      let temp:any = data;

      for (var index = 0; index < temp.custom_attributes.length; index++) {
        if (temp.custom_attributes[index].attribute_code == "thumbnail") {
          product.image = this.baseURL + temp.custom_attributes[index].value;
          break;
        }
      }
    }).catch(error => { });
  }

  getConfigurableProduct(product:any) {
    // Get configurable SKU
    if (product.parent_item) {
      if (product.parent_item.product_type == "configurable") {
        //process sku
        var configurableSKU:string;
        if (product.parent_item.sku.split('-').length > 0) {
          configurableSKU = product.parent_item.sku.split('-')[0];
        }

        this.productService.searchParentProduct(product.parent_item.name, configurableSKU).then(data => {
          var temp:any = data;
          var list:any = temp.items;

          if (list.length > 0) {
            product.configurableSKU = list[0].sku;
          }
        });
      }
    }
  }

  productTapped(index: number) {
    var sku = "";

    if (this.productList[index].configurableSKU != "") {
      sku = this.productList[index].configurableSKU;
    }
    else {
      sku = this.productList[index].sku;
    }

    this.navCtrl.push(this.productDetailPage, {
      sku: sku
    });
  }
}
