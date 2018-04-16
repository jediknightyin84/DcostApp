import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ShoppingCartServiceProvider } from '../../providers/shopping-cart-service/shopping-cart-service';
import { ProductServiceProvider } from '../../providers/product-service/product-service';
import { MySharedServiceProvider } from '../../providers/my-shared-service/my-shared-service';
import { CheckoutShippingPage } from '../checkout-shipping/checkout-shipping';
import { LoginPage } from '../login/login';
import { ProductDetailPage } from '../product-detail/product-detail';

/**
 * Generated class for the ShoppingCartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-shopping-cart',
  templateUrl: 'shopping-cart.html',
})
export class ShoppingCartPage {

  loginPage = LoginPage;
  productDetailPage = ProductDetailPage;
  checkoutShippingPage = CheckoutShippingPage;

  cartList:any = [];
  subTotal:any;
  baseURL:string;
  isLogin:boolean = false;

  //Automatic delete is current not implemented, need future research 

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public shoppingCartService: ShoppingCartServiceProvider,
    public productService: ProductServiceProvider,
    public sharedService: MySharedServiceProvider,
    private storage: Storage,
    private alertCtrl: AlertController) {
      this.baseURL = this.sharedService.baseURL;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ShoppingCartPage');
  }

  ionViewWillEnter() {
    this.checkLogin();
  }

  checkLogin() {
    this.storage.get('privateToken').then((val) => {
      if (val) {
        this.isLogin = true;
        this.createCart();
      }
      else {
        this.isLogin = false;
      }
    });
  }
  
  createCart() {
    this.shoppingCartService.createCart().then(data => {
      this.getCartList();
      this.getSubtotal();
    });
  }

  getCartList() {
    this.shoppingCartService.getCart().then(data => {
      //console.log(data);
      var localData:any = data;
      this.cartList = localData.items;

      for (var i = 0; i < this.cartList.length; i++) {
        this.cartList[i].image = 'assets/imgs/PlaceholderSample.png';
        this.getProductDetail(i);
      }

    }).catch(error => { });
  }

  getProductDetail(index:number) {
    this.productService.getProductDetail(this.cartList[index].sku).then(data => {
      //console.log(data);
      let product:any = data;

      // Image
      for (var i = 0; i < product.custom_attributes.length; i++) {
        if (product.custom_attributes[i].attribute_code == "thumbnail") {
          this.cartList[index].image = this.baseURL + product.custom_attributes[i].value;
          break;
        }
      }

      // Options
      for (i = 0; i < product.custom_attributes.length; i++) {
        if (product.custom_attributes[i].attribute_code == "color") {
          this.cartList[index].color = "";
          this.getProductAttributeOptions(index, "color", product.custom_attributes[i].value);
        }
        else if (product.custom_attributes[i].attribute_code == "size") {
          this.cartList[index].size = "";
          this.getProductAttributeOptions(index, "size", product.custom_attributes[i].value);
        }
      }

      // Get configurable SKU
      if (this.cartList[index].product_type == "configurable") {
        // Take the first part of sku and search for the configurable sku
        var configurableSKU:string;
        if (this.cartList[index].sku.split('-').length > 0) {
          configurableSKU = this.cartList[index].sku.split('-')[0];
        }
        this.productService.searchParentProduct(this.cartList[index].name, configurableSKU).then(data => {
          var localData:any = data;
          var list:any = localData.items;

          if (list.length > 0) {
            this.cartList[index].configurableSKU = list[0].sku;
          }
        });
      }

      // Get Quantity Limit
      var qtyLimit:number;
      var canIncrease:boolean;
      var canDecrease:boolean;

      // Quantity Limit from 0 to 10
      if (!product.extension_attributes.stock_item.is_in_stock) {
        qtyLimit = 0;
      }
      else {
        if (product.extension_attributes.stock_item.qty == null) {
          qtyLimit = 0;
        }
        else {
          qtyLimit = product.extension_attributes.stock_item.qty; 
        }
      }
  
      if (qtyLimit > 10) {
        qtyLimit = 10;
      }

      // Quantity 0 or 1, can not decrease
      if (this.cartList[index].qty <= 1) {
        canDecrease = false;
      }
      else {
        canDecrease = true;
      }

      // Quantity >= Quantity Limit, can not increase
      if (this.cartList[index].qty >= qtyLimit) {
        canIncrease = false;
      }
      else {
        canIncrease = true;
      }

      this.cartList[index].canIncrease = canIncrease;
      this.cartList[index].canDecrease = canDecrease;
      this.cartList[index].qtyLimit = qtyLimit;

    }).catch(error => {
    });
  }

  getProductAttributeOptions(index:number, attributeID:string, value:string) {
    this.productService.getProductAttributeOption(attributeID).then(data => {
      var list:any = data;

      for (var i = 0; i < list.length; i++) {
        if (list[i].value == value) {
          if (attributeID == "color") {
            this.cartList[index].color = list[i].label;
          }
          else if (attributeID == "size") {
            this.cartList[index].size = list[i].label;
          }
        }
      }
    });
  }

  getSubtotal() {
    this.shoppingCartService.getSubtotal().then(data => {
      var localData:any = data;
      this.subTotal = localData.subtotal;
    });
  }

  doRefresh(refresher) {
    //console.log('Begin async operation', refresher);
    this.checkLogin();
    setTimeout(() => {
      //console.log('Async operation has ended');
      refresher.complete();
    }, 1000);
  }
  
  /*
  doInfinite(infiniteScroll) {
    //console.log('Begin async operation');
    setTimeout(() => {
      //console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 1000);
  }
  */

  /* Alert */
  presentDeleteProduct(index:number) {
    let alert = this.alertCtrl.create({
      title: 'Removing Product',
      message: 'Are you sure you want to remove this product from your cart?',
      buttons: [
        {
          text: 'Never Mind',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Remove Now',
          handler: () => {
            this.deleteProduct(index);
          }
        }
      ]
    });
    alert.present();
  }

  deleteProduct(index: number) {
    this.shoppingCartService.removeProductFromCart(this.cartList[index].item_id).then(data => {
      this.getCartList();
      this.getSubtotal();
    });
  }

  loginTapped() {
    this.navCtrl.push(this.loginPage, {});
  }

  increaseTapped(index: number) {
    var qty = this.cartList[index].qty;
    qty += 1;

    if (qty >= this.cartList[index].qtyLimit) {
      qty = this.cartList[index].qtyLimit;
      this.cartList[index].canIncrease = false;
    }

    if (qty > 1) {
      this.cartList[index].canDecrease = true;
    }

    this.shoppingCartService.updateCart(this.cartList[index], qty).then(data => {
      this.getCartList();
      this.getSubtotal();
    });
  }

  decreaseTapped(index: number) {
    var qty = this.cartList[index].qty;
    qty -= 1;

    if (qty <= 1) {
      qty = 1;
      this.cartList[index].canDecrease = false;
    }

    if (qty < this.cartList[index].qtyLimit) {
      this.cartList[index].canIncrease = true;
    }

    this.shoppingCartService.updateCart(this.cartList[index], qty).then(data => {
      this.getCartList();
      this.getSubtotal();
    });

    //if (quantity <= 0) {
    //  this.shoppingCartService.removeProductFromCart(this.cartList[index].item_id).then(data => {
    //    this.getCartList();
    //    this.getSubtotal();
    //  });
    //}
    //else {
    //}
  }

  deleteTapped(index: number) {
    this.presentDeleteProduct(index);
  }

  productTapped(index: number) {
    if (this.cartList[index].product_type == "configurable") {
      this.navCtrl.push(this.productDetailPage, {
        sku:this.cartList[index].configurableSKU
      });
    }
    else {
      this.navCtrl.push(this.productDetailPage, {
        sku:this.cartList[index].sku
      });
    }
  }

  checkoutTapped() {
    this.navCtrl.push(this.checkoutShippingPage, {});
  }
}
