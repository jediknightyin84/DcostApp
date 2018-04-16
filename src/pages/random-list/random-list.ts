import { Component, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Content, ActionSheetController } from 'ionic-angular';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations/src/module';
import { ProductServiceProvider } from '../../providers/product-service/product-service';
import { ProductDetailPage } from '../product-detail/product-detail';
/**
 * Generated class for the RandomListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-random-list',
  templateUrl: 'random-list.html',
  animations: [

    trigger('flipHorizontalState', [
      state('active', style({
        transform: 'rotateY(360deg)'
      })),
      state('inactive', style({
        transform: 'rotateY(0deg)'
      })),
      transition('active => inactive', animate('1000ms ease-out')),
      transition('inactive => active', animate('1000ms ease-in'))
    ]),
  ]
})
export class RandomListPage {
  //@ViewChild('homeContent') homeContent: Content;
  productDetailPage = ProductDetailPage;

  baseURL:string = "http://ec2-35-154-79-111.ap-south-1.compute.amazonaws.com/dcost/pub/media/catalog/product";

  rowLimit:number = 5; //2
  columnLimit:number = 4;

  pinList:any = [];
  totalProductList: any = [];
  randomProductList: any = [];

  isInitial:boolean = true;

  categoryID:any;
  currentPage:number = 1;
  numberPerPage:number = 100; //100
  totalPage:number;
  randomCount:number = 0;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,     
    public actionSheetCtrl: ActionSheetController,
    public productService: ProductServiceProvider) 
  {
    this.categoryID = this.navParams.get('categoryID');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RandomListPage');

    this.generatePinList();
    this.getProductList();
  }

  generatePinList() {    
    for (var row = 0; row < this.rowLimit; row++) {
      this.pinList[row] = [];
      for (var column = 0; column < this.columnLimit; column++) {
        this.pinList[row].push(false);
      }
    }
  }

  getProductList() {
    this.productService.searchProductList(this.categoryID, this.currentPage, this.numberPerPage).then(data => {
      //console.log(data);
      var localData:any = data;
      this.totalProductList = localData.items;
      this.totalPage = Math.floor(localData.total_count / this.numberPerPage) + 1;

      if (this.isInitial) {
        this.isInitial = false;
        this.pickRandomList();
      }

    }).catch(error => {});
  }

  pickRandomList() {
    var localTotalProductList:any = [];
    var localRandomProductList:any = [];
    var prevRandomProductList:any = [];
    var randomIndex:number;

    // Save previous random product list
    if (this.randomProductList.length > 0) {
      for (var row = 0; row < this.rowLimit; row++) {
        prevRandomProductList[row] = [];
        for (var column = 0; column < this.columnLimit; column++) {
          prevRandomProductList[row][column] = this.randomProductList[row][column];
        }
      }
    }

    // Take total product list and randomly pick 20 products from it
    for (var i = 0; i < this.totalProductList.length; i++) {
      localTotalProductList.push(this.totalProductList[i]);
    }

    for (i = 0; i < this.rowLimit * this.columnLimit; i++) {
      randomIndex = Math.floor(Math.random() * localTotalProductList.length);
      localRandomProductList.push(localTotalProductList[randomIndex]);
      localTotalProductList.splice(randomIndex, 1);
    }

    // Reset random product list
    this.randomProductList = [];

    for (row = 0; row < this.rowLimit; row++) {
      this.randomProductList[row] = [];
      for (column = 0; column < this.columnLimit; column++) {

        if (this.pinList[row][column]) {
          // If product is pinned, take the previous product
          this.randomProductList[row].push(prevRandomProductList[row][column]);
        }
        else {
          let product = {
            sku: "",
            displayImage: 'assets/imgs/PlaceholderSample.png',
            image: 'assets/imgs/PlaceholderSample.png',
            horizontalState: 'inactive'
          }
          var item:any = localRandomProductList[row * 4 + column];

          product.sku = item.sku;
          for (i = 0; i < item.custom_attributes.length; i++) {
            if (item.custom_attributes[i].attribute_code == "thumbnail") {
              product.image = this.baseURL + item.custom_attributes[i].value;
              break;
            }
          }
  
          this.randomProductList[row].push(product);
        }
      }
    }
  }
 
  /* Animation */
  flipImage(product:any, row:number, column:number) {
    product.horizontalState = product.horizontalState === 'active' ? 'inactive' : 'active';
  }

  animationStarted(event, row: number, column: number) {
    this.randomProductList[row][column].displayImage = 'assets/imgs/PlaceholderSample.png';
  }

  animationDone(event, row: number, column: number) {
    this.randomProductList[row][column].displayImage = this.randomProductList[row][column].image;
  }

  /* */
  detectRandom() {
    this.randomCount += 1;

    if (this.randomCount == 10) {
      this.randomCount = 0;

      if (this.currentPage < this.totalPage - 1) {
        this.currentPage += 1;
      }
      else {
        this.currentPage = 1;
      }

      this.getProductList();
    }
  }

  presentActionSheet(row: number, column: number) {

    var pinText:string;
    var pinStatus:boolean;

    if (this.pinList[row][column]) {
      pinText = "Unpin the product"
      pinStatus = false;
    }
    else {
      pinText = "Pin the product"
      pinStatus = true;
    }

    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      cssClass: 'action-sheets-groups-page',
      buttons: [
        {
          text: pinText,
          cssClass: 'pinButton',
          //role: 'destructive',
          handler: () => {
            this.pinList[row][column] = pinStatus;
          }
        },
        {
          text: 'Cancel',
          //role: 'cancel',
          cssClass: 'cancelButton',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  /* Tap */
  randomTapped() {

    this.pickRandomList();
  
    for (var row = 0; row < this.pinList.length; row++) {
      for (var column = 0; column < this.pinList[row].length; column++) {
        if (!this.pinList[row][column]) {
          setTimeout(this.flipImage, 100 * row, this.randomProductList[row][column], row, column); 
        }
      }
    }

    this.detectRandom();
  }

  closeTapped() {
    this.navCtrl.pop();
  }

  productTapped(row: number, column: number) {
    this.navCtrl.push(this.productDetailPage, {
      sku:this.randomProductList[row][column].sku
    });
  }

  productPressed(row: number, column: number) {
    this.presentActionSheet(row, column);
  }
}
