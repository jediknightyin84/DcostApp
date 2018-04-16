import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { UserServiceProvider } from '../../providers/user-service/user-service'; 
import { ProductServiceProvider } from '../../providers/product-service/product-service';
import { OrderDetailPage } from '../order-detail/order-detail';
/**
 * Generated class for the OrderListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-order-list',
  templateUrl: 'order-list.html',
})
export class OrderListPage {

  orderDetailPage = OrderDetailPage;
  baseURL:string = "http://ec2-35-154-79-111.ap-south-1.compute.amazonaws.com/dcost/pub/media/catalog/product";

  customer:any;
  status:string = "pending";

  currentPage:number = 1;
  numberPerPage:number = 5;
  isLastPage:boolean = false;

  orderList:any = [];
  productList:any = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private alertCtrl: AlertController,
    public userService: UserServiceProvider,
    public productService: ProductServiceProvider,
    private storage: Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OrderListPage');
    this.getAccount();
  }

  getAccount() {
    this.userService.getAccount().then(data => {
      this.customer = data;
      this.getOrders();
    }).catch(error => { });
  }

  getOrders() {
    this.userService.getOrders(this.customer.id, this.status, this.currentPage, this.numberPerPage).then(data => {
      console.log(data);
      var localData:any = data;
      var localOrderList:any = localData.items;

      var totalPage:number = Math.floor(localData.total_count / this.numberPerPage) + 1;
      if (this.currentPage >= totalPage) {
        this.isLastPage = true;
      }

      for (var i = 0; i < localOrderList.length; i++) {
        this.orderList.push(localOrderList[i]);
      }

      for (var row = 0; row < localOrderList.length; row++) {
        this.productList.push([]);

        for (var column = 0; column < localOrderList[row].items.length; column++) {
          // Each item has simple and repeated configure 
          if (localOrderList[row].items[column].product_type == "simple") {
            var product = localOrderList[row].items[column];
            product.image = 'assets/imgs/PlaceholderSample.png';
            this.productList[this.productList.length - 1].push(product);
            this.getProductDetail(product);
          }
        }
      }
      /*
      for (var row = 0; row < this.orderList.length; row++) {
        this.productList[row] = [];

        for (var column = 0; column < this.orderList[row].items.length; column++) {
          // Because item has simple and repeated configure 
          if (this.orderList[row].items[column].product_type == "simple") {
            var product = this.orderList[row].items[column];
            product.image = "assets/imgs/logo.png";
            this.productList[row].push(product);
            this.getProductDetail(product);
          }
        }
      }
      */
    });
  }

  getProductDetail(product:any) {
    this.productService.getProductDetail(product.sku).then(data => {
      let productData:any = data;

      for (var index = 0; index < productData.custom_attributes.length; index++) {
        if (productData.custom_attributes[index].attribute_code == "thumbnail") {
          product.image = this.baseURL + productData.custom_attributes[index].value;
          break;
        }
      }
    }).catch(error => { });
  }

  doRefresh(refresher) {
    //console.log('Begin async operation', refresher);
    this.currentPage = 1;
    this.isLastPage = false;
    this.orderList = [];
    this.productList = [];
    this.getOrders();

    setTimeout(() => {
      //console.log('Async operation has ended');

      refresher.complete();
    }, 1000);
  }
  
  doInfinite(infiniteScroll) {
    //console.log('Begin async operation');

    this.currentPage += 1;
    this.getOrders();

    setTimeout(() => {
      //console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 1000);
  }

  /* Alert */
  presentSupport(title: any, text: any) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: text,
      buttons: ['Okay']
    });
    alert.present();
  }

  presentCancelOrder(index:number) {
    let alert = this.alertCtrl.create({
      title: 'Cancel Order',
      message: 'Are you sure you want to cancel this order?',
      buttons: [
        {
          text: 'Never mind',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes, cancel order',
          handler: () => {
            this.cancelOrder(index);
          }
        }
      ]
    });
    alert.present();
  }

  cancelOrder(index:number) {
    this.userService.cancelOrder(this.orderList[index].entity_id).then(data => {
      //console.log(data);
    });
  }

  /* Action */
  segmentChanged(event:any) {
    this.status = event.value;
    this.currentPage = 1;
    this.isLastPage = false;
    this.orderList = [];
    this.productList = [];
    this.getOrders();
  }

  orderTapped(index:number) {
    this.navCtrl.push(this.orderDetailPage, {
      orderID: this.orderList[index].entity_id
    });
  }

  cancelTapped(index:number) {
    if (this.orderList[index].status == 'pending') {
      this.presentCancelOrder(index);
    }
    else {
      this.presentSupport('Contact Us', 'Please contact our customer service regarding your order cancelling.\n abc@dcost.com');
    }
  }
}
