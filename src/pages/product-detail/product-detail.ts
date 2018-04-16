import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, PopoverController, ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { ProductServiceProvider } from '../../providers/product-service/product-service';
import { ShoppingCartServiceProvider } from '../../providers/shopping-cart-service/shopping-cart-service';

import { ProductInfoPage } from '../product-info/product-info';
import { ShoppingCartPage } from '../shopping-cart/shopping-cart';
import { LoginPage } from '../login/login';

import { AstTransformer } from '@angular/compiler/src/output/output_ast';

/**
 * Generated class for the ProductDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-detail',
  templateUrl: 'product-detail.html',
})
export class ProductDetailPage {

  productInfoPage = ProductInfoPage;
  shoppingCartPage = ShoppingCartPage;
  loginPage = LoginPage;

  baseURL:string = "http://ec2-35-154-79-111.ap-south-1.compute.amazonaws.com/dcost/pub/media/catalog/product";    
  imageURLs:any = [];

  sku:string;
  productDetail:any = {};

  optionNames:any = []; //size, color
  optionIDs:any = [];
  optionDetails:any = []; //index, actual label such as red/black, S/M/L, with selected
  
  configProductChildren:any = [];
  isConfigurable:boolean = false;

  productPrice:any;
  iconURL:string;
  quantity:number = 1;
  quantityLimit:number = 10;
  isIncreaseDisabled:boolean = false;
  isDecreaseDisabled:boolean = false;

  overlayHidden: boolean = true;
  //screenHeight:number;
  //privateToken:string;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public platform: Platform, 
    private storage: Storage, 
    public popoverCtrl: PopoverController, 
    private toastCtrl: ToastController,
    public productService: ProductServiceProvider,
    public shoppingCartService: ShoppingCartServiceProvider) {

    this.sku = this.navParams.get('sku');

    //platform.ready().then((readySource) => {
      //console.log('Width: ' + platform.width());
      //console.log('Height: ' + platform.height());
      //this.screenHeight = platform.height();
    //});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductDetailPage');
    this.getProductDetail();
    this.getProductImage();
    //this.checkLoginStatus();
  }

  //checkLoginStatus() {
  //}

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

 /*
  * 
  *
  */
  getProductDetail() {
    this.productService.getProductDetail(this.sku).then(data => {
      this.productDetail = data;

      if (this.productDetail.type_id == "configurable") {
        // Configurable Product
        this.getConfigurableProductChildren();
        this.isConfigurable = true;

      }
      else {
        // Simple Product
        this.getSimpleProduct(this.sku);
        this.isConfigurable = false;
      }
    });
  }

  getProductImage() {
    this.productService.getProductImage(this.sku).then(data => {
      var list:any = data;

      for (var i = 0; i < list.length; i++) {
        this.imageURLs.push(this.baseURL + list[i].file);
      }
    });
  }

  getConfigurableProductChildren() {
    this.productService.getConfigurableProductChildren(this.sku).then(data => {
      //console.log(data);
      this.configProductChildren = data; 

      // Get options
      var options:any = [];
      options = this.productDetail.extension_attributes.configurable_product_options;
      for (var index = 0; index < options.length; index++) {
        this.optionNames[index] = options[index].label;
        this.optionIDs[index] = options[index].attribute_id;

        this.optionDetails[index] = [];
        this.getOptionDetail(options[index].attribute_id, index, options[index].values);
      }

      this.loadIcon(this.productDetail);

    });
  }

  getOptionDetail(attributeID:string, index:number, valueList:any) {
    this.productService.getProductAttributeOption(attributeID).then(data => {
      var labelList:any = data;
      var optionList:any = [];

      // Convert value to labels and add select status
      for (var l = 0; l < labelList.length; l++) {
        for (var v = 0; v < valueList.length; v++) {
          if (valueList[v].value_index == labelList[l].value) {
            var option:any = {
              "name":"",
              "index":0,
              "selected":false
            }
            option.name = labelList[l].label;
            option.index = labelList[l].value;
            option.selected = false;
            optionList.push(option);
          }
        }
      }
      this.optionDetails[index] = optionList;

      if (this.detectOptionReady()) {
        this.preselectOption();
        this.getSimpleProduct(this.searchSimpleSKU());
      }
    });
  }

  detectOptionReady() {
    var isReady:boolean = true;
    for (var i = 0; i < this.optionDetails.length; i++) {
      if (this.optionDetails[i].length == 0) {
        isReady = false;
      }
    }
    return isReady;
  }

  preselectOption() {
    for (var i = 0; i < this.optionDetails.length; i++) {
      this.optionDetails[i][0].selected = true;
    }
  }

  searchSimpleSKU() {
    var sizeIndex:number;
    var colorIndex:number;

    for (var i = 0; i < this.optionDetails.length; i++) {
      if (this.optionNames[i] == "Size") {
        for (var j = 0; j < this.optionDetails[i].length; j++) {
          if (this.optionDetails[i][j].selected) {
            sizeIndex = this.optionDetails[i][j].index;
            break;
          }
        }
      }
      else if (this.optionNames[i] == "Color") {
        for (j = 0; j < this.optionDetails[i].length; j++) {
          if (this.optionDetails[i][j].selected) {
            colorIndex = this.optionDetails[i][j].index;
            break;
          }
        }
      }
    }

    var childSKU:string;

    for (i = 0; i < this.configProductChildren.length; i++) {
      var matchCount:number = 0;
      var list:any = [];
      list = this.configProductChildren[i].custom_attributes;

      for (j = 0; j < list.length; j++) {
        if (list[j].attribute_code == "size") {
          if (list[j].value == sizeIndex) {
            matchCount++;
          }
        }
        else if (list[j].attribute_code == "color") {
          if (list[j].value == colorIndex) {
            matchCount++;
          }
        }
      }

      if (matchCount == 2) { 
        childSKU = this.configProductChildren[i].sku;
        break;
      }
    }

    return childSKU;
  }

  getSimpleProduct(sku:string) {
    this.productService.getProductDetail(sku).then(data => {
      var simpleProduct:any = data;
      this.updateQuantity(simpleProduct);
      this.loadIcon(simpleProduct);
      this.loadPrice(simpleProduct);
    });
  }

  updateQuantity(simpleProduct:any) {
    if (!simpleProduct.extension_attributes.stock_item.is_in_stock) {
      this.quantityLimit = 0;
    }
    else {
      this.quantityLimit = simpleProduct.extension_attributes.stock_item.qty; 

      if (simpleProduct.extension_attributes.stock_item.qty == null) {
        this.quantityLimit = 0;
      }
    }

    if (this.quantityLimit <= 1) {
      this.isIncreaseDisabled = true;
      this.isDecreaseDisabled = true;
      this.quantity = this.quantityLimit;
    }
    else {
      this.isDecreaseDisabled = true;
      this.isIncreaseDisabled = false;
      this.quantity = 1;

      if (this.quantityLimit > 10) {
        this.quantityLimit = 10;
      }
    }
  }

  loadIcon(product:any) {
    for (var i = 0; i < product.custom_attributes.length; i++) {
      if (product.custom_attributes[i].attribute_code == "thumbnail") {
        this.iconURL = this.baseURL + product.custom_attributes[i].value;
        break;
      }
    }
  }

  loadPrice(product:any) {
    this.productPrice = product.price;
  }

  addConfigurableProduct(quoteID:string) {
    var list:any = [];

    for (var i = 0; i < this.optionIDs.length; i++) {
      var value:number;

      for (var j = 0; j < this.optionDetails[i].length; j++) {
        if (this.optionDetails[i][j].selected) {
          value = this.optionDetails[i][j].index;
          break;
        }
      }

      let option = {
        "option_id": this.optionIDs[i],
        "option_value": value
      }

      list.push(option)
    }

    //console.log(list);
    this.shoppingCartService.addConfigurableToCart(quoteID, this.quantity, this.sku, list).then(data => {
      console.log(data);
      this.presentToast("Product is added to cart");
    });
  }

  addSimpleProduct(quoteID:string) {
    this.shoppingCartService.addSimpleToCart(quoteID, this.quantity, this.sku).then(data => {
      console.log(data);
      this.presentToast("Product is added to cart");
    });
  }

  addToCart() {
    this.storage.get('privateToken').then((val) => {
      if (val) {
        this.overlayHidden = false;
      }
      else {
        this.navCtrl.push(this.loginPage, {});
      }
    });

    //if (this.privateToken == "") {
    //  this.navCtrl.push(this.loginPage, {});
    //}
    //else {
    //  this.overlayHidden = false;
    //}
  }

  /* Add to cart */
  optionTapped(mainIndex:number, subIndex:number) {
    for (var i = 0; i < this.optionDetails[mainIndex].length; i++) {
      this.optionDetails[mainIndex][i].selected = false;
    }
    this.optionDetails[mainIndex][subIndex].selected = true;
    this.getSimpleProduct(this.searchSimpleSKU());
  }

  increaseTapped() {
    this.quantity += 1;

    if (this.quantity >= this.quantityLimit) {
      this.isIncreaseDisabled = true;
      this.quantity = this.quantityLimit;
    }

    if (this.quantity > 1) {
      this.isDecreaseDisabled = false;
    }
  }

  decreaseTapped() {
    this.quantity -= 1;

    if (this.quantity <= 1) {
      this.isDecreaseDisabled = true;
      this.quantity = 1;
    }

    if (this.quantity < this.quantityLimit) {
      this.isIncreaseDisabled = false;
    }
  }

  cancelTapped() {
    this.overlayHidden = true;
  }

  confirmTapped() {
    //this.overlayHidden = true;

    this.shoppingCartService.createCart().then(data => {
      var quoteID:any = data;

      if (this.isConfigurable) {
        this.addConfigurableProduct(quoteID);
      }
      else {
        this.addSimpleProduct(quoteID);
      }
    }); 
  }

  /* Shopping cart, information, close */
  cartTapped() {
    this.navCtrl.push(this.shoppingCartPage, {});
  }

  infoTapped() {
    this.navCtrl.push(this.productInfoPage, {
      sku: this.sku
    });
  }

  closeTapped() {
    this.navCtrl.pop();
  }
}
