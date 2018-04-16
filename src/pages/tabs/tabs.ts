import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { CategoryListPage } from '../category-list/category-list';
import { PreferencePage } from '../preference/preference';
//import { RandomListPage } from '../random-list/random-list';
import { AccountPage } from '../account/account';
import { ShoppingCartPage } from '../shopping-cart/shopping-cart';


import { MySharedServiceProvider } from '../../providers/my-shared-service/my-shared-service';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  //tab1Root = HomePage;
  //tab1Root = PreferencePage;
  //tab2Root = RandomListPage;
  tab1Root = PreferencePage;
  tab2Root = CategoryListPage;
  tab3Root = ShoppingCartPage;
  tab4Root = AccountPage;

  //showsTab: boolean = true;
  constructor(private service: MySharedServiceProvider) {
    //this.service.dataChange.subscribe((data) => {
      //console.log('From Tab' + data.showsTab);
      //this.showsTab = data.showsTab;
    //});
  }
}
