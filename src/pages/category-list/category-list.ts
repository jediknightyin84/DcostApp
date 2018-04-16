import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ProductServiceProvider } from '../../providers/product-service/product-service';
import { ProductListPage } from '../product-list/product-list';
import { ProductDetailPage } from '../product-detail/product-detail';
import { SearchPage } from '../search/search';
/**
 * Generated class for the CategoryListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-category-list',
  templateUrl: 'category-list.html',
})
export class CategoryListPage {

  productListPage = ProductListPage;
  productDetailPage = ProductDetailPage;
  searchPage = SearchPage;

  baseURL:string = "http://ec2-35-154-79-111.ap-south-1.compute.amazonaws.com/dcost/pub/media/catalog/product";

  categoryList:any = [];
  productList:any = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public productService: ProductServiceProvider,
    public modalCtrl: ModalController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoryListPage');
    this.getCategoryList();
  }

  reload() {
    this.getCategoryList();
  }

  getCategoryList() {
    this.productService.getCategoryList().then(data => {
      console.log(data);
      var defaultCategory:any = data;

      for (var i = 0; i < defaultCategory.children_data.length; i++) {
        if (defaultCategory.children_data[i].is_active) {
          this.categoryList.push(defaultCategory.children_data[i]);
        }
      }

      for (i = 0; i < this.categoryList.length; i++) {
        this.productList[i] = [];
        this.getProductList(this.categoryList[i].id, i);
      }
    }).catch(error => {
    });
  }

  getProductList(categoryID:number, categoryIndex:number) {
    this.productService.getCategoryProductList(categoryID).then(data => {
      //console.log(data);
      var list:any = data;

      //Limit to 7 elements only
      var upperLimit:number = list.length + 2;
      if (upperLimit > 7) {
        upperLimit = 7;
      }

      for (var i = 0; i < upperLimit; i++) {
        if ((i == 0) || (i == upperLimit - 1)) {
          this.productList[categoryIndex].push("");
        }
        else {
          this.productList[categoryIndex].push(list[i - 1]);
          list[i - 1].image = "assets/imgs/PlaceholderSample.png";
        }
      }

      //Get Image
      for (var productIndex = 1; productIndex < this.productList[categoryIndex].length - 1; productIndex++) {
        this.getProductImage(this.productList[categoryIndex][productIndex].sku, categoryIndex, productIndex);
      }

    }).catch(error => {});
  }

  getProductImage(sku:string, categoryIndex:number, productIndex:number) {
    this.productService.getProductImage(sku).then(data => {
      //console.log(data);
      var list:any = data;

      //indexOf() == -1
      for (var i = 0; i < list.length; i++) {
        if (list[i].types.includes("thumbnail")) {
          this.productList[categoryIndex][productIndex].image = this.baseURL + list[i].file;
          break;
        }
      }
    }).catch(error => {});
  }
  
  presentModal() {
    let searchModal = this.modalCtrl.create(this.searchPage, 
      { 
        'keyword': "",
        'categoryID': ""
      });

    searchModal.onDidDismiss(data => {
      console.log(data);
      if (data.keyword != "") {
        this.navCtrl.push(this.productListPage, {
          keyword: data.keyword,
          categoryID: data.categoryID
        });
      }
    });
  
    searchModal.present();
  }
  
  productListTapped(categoryID:number) {
    this.navCtrl.push(this.productListPage, {
      keyword: "",
      categoryID: categoryID
    });
  }

  productDetailTapped(sku:string) {
    this.navCtrl.push(this.productDetailPage, {
      sku: sku
    });
  }

  searchTapped() {
    this.presentModal();  
  }
}
