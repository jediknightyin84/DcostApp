import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { ProductServiceProvider } from '../../providers/product-service/product-service';

import { ProductListPage } from '../product-list/product-list';
/**
 * Generated class for the SearchPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  productListPage = ProductListPage;
  
  searchKeyword:string = "";
  selectedCategory:string = "";
  initialKeyword:string = "";

  historyList:any = [];
  categoryList:any = [];
  isHistory:boolean = true;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private storage: Storage,
    public productService: ProductServiceProvider,
    public viewCtrl: ViewController) {

      this.searchKeyword = this.navParams.get('keyword');
      this.selectedCategory = this.navParams.get('categoryID');

      //if (this.searchKeyword != "") {
      this.initialKeyword = this.navParams.get('keyword');
      //}
      //this.isFromHome = this.navParams.get('home');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SearchPage');
    this.getHistory();

    this.getCategoryList();
  }

  getHistory() {
    this.storage.get('history').then((val) => {
      if (val) {
        this.historyList = val;
      }
      else {
        this.storage.set('history', this.historyList);
      }
    });
  }

  getCategoryList() {
    this.productService.getCategoryList().then(data => {
      //console.log(data);
      var defaultCategory:any = data;

      for (var i = 0; i < defaultCategory.children_data.length; i++) {
        if (defaultCategory.children_data[i].is_active) {
          this.categoryList.push(defaultCategory.children_data[i]);
        }
      }
      if (this.searchKeyword != "") {
        this.searchKeywordTest();
      }
    
    }).catch(error => {
    });
  }

  searchKeywordTest() {
    //this.categoryList = [];
    for (var i = 0 ; i < this.categoryList.length; i++) {
      this.categoryList[i].searchedProductCount = 0;
      this.searchKeywordWithID(i);
    }
  }

  searchKeywordWithID(index:number) {
    this.productService.searchProductWithKeyword(this.searchKeyword, this.categoryList[index].id).then(data => {
      //console.log(data);
      var temp:any = data;
      this.categoryList[index].searchedProductCount = temp.total_count;
    });
  }

  saveHistory() {
    if (this.searchKeyword == "") {
      return;
    }

    var isMatched:boolean = false;

    if (this.historyList.length == 0) {
      this.historyList.push(this.searchKeyword);
    }
    else if (this.historyList.length >= 10) {
      for (var i = 0; i < this.historyList.length; i++) {
        if (this.historyList[i] == this.searchKeyword) {
          this.historyList.splice(i, 1);
          this.historyList.push(this.searchKeyword);
          isMatched = true;
          break;
        }
      }

      if (!isMatched) {
        this.historyList.splice(0, 1);
        this.historyList.push(this.searchKeyword);
      }
    }
    else {
      for (i = 0; i < this.historyList.length; i++) {
        if (this.historyList[i] == this.searchKeyword) {
          this.historyList.splice(i, 1);
          this.historyList.push(this.searchKeyword);
          isMatched = true;
          break;
        }
      }

      if (!isMatched) {
        this.historyList.push(this.searchKeyword);
      }
    }

    this.storage.set('history', this.historyList);

    this.searchKeywordTest();
  }

  /* Searchbar */
  onInput(event:any) {
    if (this.searchKeyword == "") {
      this.isHistory = true;
    }    
    //else {
    //  this.isHistory = false;
    //}
  }

  onCancel(event:any) {
  }

  searchTapped() {
    this.isHistory = false;

    this.saveHistory();

  }

  clearTapped() {
    this.storage.remove('history');
    this.historyList = [];
  }

  /* History */
  historyTapped(index:number) {
    this.isHistory = false;
    this.searchKeyword = this.historyList[index];

    for (var i = 0 ; i < this.categoryList.length; i++) {
      this.categoryList[i].searchedProductCount = 0;
      this.searchKeywordWithID(i);
    }
  }

  /* Category */
  categoryTapped(index:number) {
    let data = { 
      'keyword': this.searchKeyword,
      'categoryID': this.categoryList[index].id
    };

    this.viewCtrl.dismiss(data);
  }

  closeTapped() {
    
    let data = { 
      'keyword': this.initialKeyword,
      'categoryID': ""
    };

    this.viewCtrl.dismiss(data);
  }
}
