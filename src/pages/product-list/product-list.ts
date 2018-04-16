import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ProductServiceProvider } from '../../providers/product-service/product-service';
import { templateJitUrl } from '@angular/compiler';

import { ProductDetailPage } from '../product-detail/product-detail';
import { SearchPage } from '../search/search';
/**
 * Generated class for the ProductListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-product-list',
  templateUrl: 'product-list.html',
})
export class ProductListPage {

  productDetailPage = ProductDetailPage;
  searchPage = SearchPage;

  baseURL:string = "http://ec2-35-154-79-111.ap-south-1.compute.amazonaws.com/dcost/pub/media/catalog/product";

  currentPage:number = 1;
  numberPerPage:number = 20;
  isLastPage:boolean = false;
  productList:any = [];

  categoryName:string;
  categoryList:any = [];

  categoryID:number;
  searchKeyword:string = "";

  attributeID:number;

  isSortingOn:boolean = false;
  sortingType:string = "";

  isFilterOn:boolean = false;
  filterList:any = [];
  filterExpandList:any = [];

  lowerPrice:string = "";
  upperPrice:string = "";
  
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    private storage: Storage,
    private alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public productService: ProductServiceProvider) {

      this.categoryID = this.navParams.get('categoryID');
      this.searchKeyword = this.navParams.get('keyword');

      //if (this.navParams.get('keyword') != undefined) {
      //}
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductListPage');

    this.sortingType = "default";
    //this.getFilter();
    this.getCategoryDetail();
    this.searchProducts();
  }

  getCategoryDetail() {
    this.productService.getCategory(this.categoryID).then(data => {
      console.log(data);
      let localData:any = data;
      this.categoryName = localData.name;
      var subList = localData.children.split(',');

      for (var i = 0; i < subList.length; i++) {
        var category = {
          name: "",
          id: subList[i],
          selected: false
        }

        this.categoryList.push(category);
        this.getSubCategoryDetail(category);
      }

      // Get Filter
      if (this.categoryName == "Men" || this.categoryName == "Women") {
        this.attributeID = 9;
      }
      //else if (this.categoryName == "Gear") {
      //  this.attributeID = 15;
      //}
      this.getFilter();

    }).catch(error => { });
  }

  getSubCategoryDetail(category:any) {
    this.productService.getCategory(category.id).then(data => {
      var localData:any = data;
      category.name = localData.name;
    });
  }

  getFilter() {
    this.productService.getAttributeList(this.attributeID).then(data => {
      //console.log(data);
      var list:any = data;

      for (var i = 0; i < list.length; i++) {
        if (list[i].frontend_input == "multiselect") {
          if (list[i].attribute_code == "style_general" 
          || list[i].attribute_code == "material"
          || list[i].attribute_code == "pattern"
          || list[i].attribute_code == "climate") {
            for (var j = 0; j < list[i].options.length; j++) {
              list[i].options[j].selected = false;
            }
            this.filterList.push(list[i]);
            this.filterExpandList.push(false);
          }
        }
      
        if (list[i].attribute_code == "size" 
        || list[i].attribute_code == "color") {
          for (j = 0; j < list[i].options.length; j++) {
            list[i].options[j].selected = false;
          }
          this.filterList.push(list[i]);
          this.filterExpandList.push(false);
        }
      }
      //price
    })
  }

  searchProducts() {    
    var categoryID:string = String(this.categoryID);

    for (var i = 0; i < this.categoryList.length; i++) {
      if (this.categoryList[i].selected) {
        categoryID = this.categoryList[i].id;
        break;
      }
    }

    this.productService.searchProductWithFilters(this.filterList, categoryID, this.lowerPrice, this.upperPrice, this.sortingType, this.searchKeyword, this.currentPage, this.numberPerPage).then(data => {
      console.log(data);

      var localData:any = data;
      var localProductList:any = localData.items;
  
      var totalPage:number = Math.floor(localData.total_count / this.numberPerPage) + 1;
      if (this.currentPage >= totalPage) {
        this.isLastPage = true;
      }

      // Calculate row limit
      let rowLimit:number = Math.floor(localProductList.length / 4);
      let columnLimit:number = 4;

      if (rowLimit == 0) {
        rowLimit = 1;
      }

      for (var row = 0; row < rowLimit; row++) {
        this.productList.push([]);

        // Calculate column limit
        if (row == rowLimit - 1) {
          columnLimit = localProductList.length % 4;
          if (columnLimit == 0) {
            columnLimit = 4;
          }
        }
        else {
          columnLimit = 4;
        }

        for (var column = 0; column < columnLimit; column++) {
          var product:any = localProductList[row * 4 + column];

          // Load image
          for (var index = 0; index < product.custom_attributes.length; index++) {
            if (product.custom_attributes[index].attribute_code == "thumbnail") {
              product.image = this.baseURL + product.custom_attributes[index].value;
              break;
            }
          }

          this.productList[this.productList.length - 1].push(product);
        }
      }
    });
  }

  resetParameters() {
    this.currentPage = 1;
    this.isLastPage = false;
    this.productList = [];
  }

  doRefresh(refresher) {
    //console.log('Begin async operation', refresher);
    this.resetParameters();
    this.searchProducts();
    setTimeout(() => {
      //console.log('Async operation has ended');
      refresher.complete();
    }, 1000);
  }
  
  doInfinite(infiniteScroll) {
    //console.log('Begin async operation');
    this.currentPage += 1;
    this.searchProducts();
    setTimeout(() => {
      //console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 1000);
  }

  /* Modal */
  presentModal() {
    let searchModal = this.modalCtrl.create(this.searchPage, 
    { 
      'keyword': this.searchKeyword,
      'categoryID': this.categoryID
    });

    searchModal.onDidDismiss(data => {
      //console.log(data);
      this.categoryID = data.categoryID;
      this.searchKeyword = data.keyword;

      this.resetParameters();
      this.searchProducts();
    });
    searchModal.present();
  }

  /* Product Detail */
  productTapped(row:number, column:number) {
    this.navCtrl.push(this.productDetailPage, {
      sku:this.productList[row][column].sku
    });
  }

  /* Filter */
  categoryTapped(index: number) {
    for (var i = 0; i < this.categoryList.length; i++) {
      this.categoryList[i].selected = false;
    }
    this.categoryList[index].selected = true;
  }

  optionTapped(filterIndex:number, optionIndex:number) {
    this.filterList[filterIndex].options[optionIndex].selected = !this.filterList[filterIndex].options[optionIndex].selected;
  }

  /* Sorting */
  sortTapped() {
    this.isSortingOn = !this.isSortingOn;
    this.isFilterOn = false;
  }

  sortingTypeTapped(event:any) {
    this.isSortingOn = false;

    this.resetParameters();
    this.searchProducts();
  }

  /* Filter */
  filterTapped() {
    this.isFilterOn = !this.isFilterOn;
    this.isSortingOn = false;
  }

  applyTapped() {
    this.isFilterOn = false;

    this.resetParameters();
    this.searchProducts();
  }

  clearTapped() {
    this.isFilterOn = false;

    this.lowerPrice = "";
    this.upperPrice = "";

    for (var i = 0; i < this.categoryList.length; i++) {
      this.categoryList[i].selected = false;
    }

    for (var row = 0; row < this.filterList.length; row++) {
      for (var column = 0; column < this.filterList[row].length; column++) {
        this.filterList[row].options[column].selected = false;
      }
    }
   
    this.resetParameters();
    this.searchProducts();
  }

  expandTapped(index:number) {
    this.filterExpandList[index] = !this.filterExpandList[index];
  }

  /* Searchbar */
  searchTapped() {
    this.presentModal();
  }
}
