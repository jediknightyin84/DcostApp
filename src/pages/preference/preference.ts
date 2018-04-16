import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Tabs, ModalController } from 'ionic-angular';
import { trigger, state, style, transition, animate, keyframes } from '@angular/core';
import { Storage } from '@ionic/storage';
import { ProductServiceProvider } from '../../providers/product-service/product-service';
import { RandomListPage } from '../random-list/random-list';
import { TutorialPage } from '../tutorial/tutorial';
/**
 * Generated class for the PreferencePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-preference',
  templateUrl: 'preference.html',
})
export class PreferencePage {

  tutorialPage = TutorialPage;
  randomListPage = RandomListPage;
  categoryList:any = [];

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private storage: Storage,
    public productService: ProductServiceProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreferencePage');
    //this.detectFirstLaunch();
    this.getCategoryList();
  }
 
  detectFirstLaunch() {

    this.storage.get('isFirstLaunch').then((val) => {
      if (val) {
        // do nothing
      }
      else {
        this.storage.set('isFirstLaunch', true);
        this.presentModal();
      }
    });

    this.presentModal();
  }

  presentModal() {
    let searchModal = this.modalCtrl.create(this.tutorialPage, {});
    
    /*
    searchModal.onDidDismiss(data => {
      console.log(data);
    });
    */
  
    searchModal.present();
  }

  getCategoryList() {
    this.productService.getCategoryList().then(data => {
      //console.log(data);
      var defaultCategory:any = data;
      var activeCategoryList:any = [];

      for (var i = 0; i < defaultCategory.children_data.length; i++) {
        if (defaultCategory.children_data[i].is_active) {
          activeCategoryList.push(defaultCategory.children_data[i]);
        }
      }

      let columnLimit = 2;
      let rowList:any = [];
      
      //activeCategoryList.length
      
      for (i = 0; i < activeCategoryList.length; i++) {
        if (i % columnLimit == 0) {
          rowList = []
          this.categoryList.push(rowList);
        }
    
        switch (activeCategoryList[i].name) {
          case "Men":
            activeCategoryList[i].image = "assets/imgs/PreferenceSample01.png";
            break;
          case "Women":
            activeCategoryList[i].image = "assets/imgs/PreferenceSample02.png";
            break;
          case "Gear":
            activeCategoryList[i].image = "assets/imgs/PreferenceSample03.png";
            break;
          default:
            break;
        }
        rowList.push(activeCategoryList[i]);   
      }
    }).catch(error => {});
  }

  categoryTapped(row: number, column: number) {
    this.navCtrl.push(this.randomListPage, {
      categoryID: this.categoryList[row][column].id
    })
  }
}
