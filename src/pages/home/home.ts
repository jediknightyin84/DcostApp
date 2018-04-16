import { Component, Input, ViewChild, ViewChildren, AfterViewInit, QueryList, NgZone } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/core';

import { NavController, NavParams, Platform, Content, Slides } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular';

import { ProductDetailPage } from '../product-detail/product-detail';
import { PreferencePage } from '../preference/preference';
import { SearchPage } from '../search/search';

import { MySharedServiceProvider } from '../../providers/my-shared-service/my-shared-service';
import { ProductServiceProvider } from '../../providers/product-service/product-service';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations/src/module';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [

    trigger('flipHorizontalState', [
      state('active', style({
        transform: 'rotateY(360deg)'
      })),
      state('inactive', style({
        transform: 'rotateY(0deg)'
      })),
      transition('active => inactive', animate('500ms ease-out')),
      transition('inactive => active', animate('500ms ease-in'))
    ]),

    trigger('flipVerticalState', [
      state('active', style({
        transform: 'rotateX(360deg)'
      })),
      state('inactive', style({
        transform: 'rotateX(0)'
      })),
      transition('active => inactive', animate('500ms ease-out')),
      transition('inactive => active', animate('500ms ease-in'))
    ]),
  ]
})
export class HomePage {

  @ViewChild('homeContent') homeContent: Content;
  @ViewChildren('productSlides') productSlides: QueryList<Slides>;

  productDetailPage = ProductDetailPage;
  preferencePage = PreferencePage;
  searchPage = SearchPage;

  products: any = [];
  count: number = 0;
  links: any = [];

  savedProducts: any = [];
  tabBarElement: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform, 
    private service: MySharedServiceProvider,
    public zone: NgZone,
    public productService: ProductServiceProvider) {

    platform.ready().then((readySource) => {
      //console.log('Width: ' + platform.width());
      //console.log('Height: ' + platform.height());
      //this.rowHeight = platform.height() / 5;
    });

    //.show-tabbar
    this.tabBarElement = document.querySelector('.tabbar');
    //console.log(document.querySelector("ion-tab"));
  }

  ngAfterViewInit() {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StackStatusPage');

    //this.links = ['http://139.196.108.236/ngs/fs/get?file=BIG/IISZ0021201707230141_1.jpg',
    //  'http://139.196.108.236/ngs/fs/get?file=BIG/AASY002201707100061_1.jpg',
    //  'http://139.196.108.236/ngs/fs/get?file=BIG/IISZ002201710210081_1.jpg',
    //  'http://139.196.108.236/ngs/fs/get?file=BIG/AAHZ003201703200131_1.jpg',
    //  'http://139.196.108.236/ngs/fs/get?file=BIG/AAQD001201703020291_1.jpg'];

    this.links = ['assets/imgs/product01.jpg',
      'assets/imgs/product02.jpg',
      'assets/imgs/product03.jpg',
      'assets/imgs/product01.jpg',
      'assets/imgs/product02.jpg'];

    let rowNumber = 50;
    let eachRow: any = [];

    for (var _i = 0; _i < 1000; _i++) {
        if (_i % rowNumber == 0) {
          eachRow = []
          this.products.push(eachRow);
        }

        let product = {
          name: this.links[_i % 5],
          horizontalState: 'inactive',
          verticalState: 'inactive',
          isPinned: false
        };
        eachRow.push(product);
    }

    for (var _j = 0; _j < 20; _j++) {
      if (_j % 4 == 0) {
        eachRow = []
        this.savedProducts.push(eachRow);
      }

      let savedProducts = {
        name: this.links[_j % 5],
        horizontalState: 'inactive',
        verticalState: 'inactive',
        isPinned: false
      };
      eachRow.push(savedProducts);
    }

    //this.tabBarElement.style.opacity = 0;
    //this.tabBarElement.style.display = 'none';
    //this.tabBarElement.style.visibility = 'hidden';

    //this.productService.getAttributeSetList().then(data => {
    //  console.log(data);
    //});

    //this.productService.getAttributeList('9').then(data => {
    //  console.log(data);
    //});

    //this.productService.getProductList().then(data => {
    //  console.log(data);
    //});

    //this.productService.getProductDetail('WJ12').then(data => {
    //  console.log(data);
    //});
  }
 

  ionViewDidEnter() {
    for (var _i = 0; _i < this.productSlides.length; _i++) {
      this.productSlides.toArray()[_i].freeMode = true;
    }
  }

  ionViewWillLeave() {
  }

  presentActionSheet(row: number, column: number) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Pin or Unpin',
      buttons: [
        {
          text: 'Pin',
          //role: 'destructive',
          handler: () => {
            this.products[row][column].isPinned = true;
            //console.log('Destructive clicked');
          }
        },{
          text: 'Unpin',
          handler: () => {
            this.products[row][column].isPinned = false;
            //console.log('Archive clicked');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  goToProductDetail(row: number, column: number) {
    this.navCtrl.push(this.productDetailPage, {});
  }

  longPress(row: number, column: number) {
    this.presentActionSheet(row, column);
  }

  addToFavorite(row: number, column: number) {
    this.presentActionSheet(row, column);
  }

  didDrag(event) {
    console.log(event);
  }

  swipeEvent(event, row: number, column: number) {
    //console.log(event);

    //this.verticalSlides.setElementStyle("visibility", "visible");

    //if (event.direction == 8) {
    //  this.verticalSlides.slidePrev();
    //}
    //else if (event.direction == 16) {
    //  this.verticalSlides.slideNext();
    //}
  }

  animationStarted(event, row: number, column: number) {
    //console.log(event);
    this.products[row][column].name = 'assets/imgs/sample-placeholder.jpg';
  }

  animationDone(event, row: number, column: number) {
    //console.log(event);
    this.count += 1;
    this.products[row][column].name = this.links[this.count % 5];
  }

  toggleTab(event) {
    if (event.direction == 8) {
      //swipe up
      this.tabBarElement.style.visibility = 'visible';
    }
    else if (event.direction == 16) {
      //swipe down
      this.tabBarElement.style.visibility = 'hidden';
    }
  }

  randomizeProducts(event) {

    //fix here 

    /*
    for (var _row = 0; _row < 5; _row++) {
      for (var _col = 0; _col < 20; _col++) {
        if (!this.products[_row][_col].isPinned) {
          this.products[_row][_col].horizontalState = this.products[_row][_col].horizontalState === 'active' ? 'inactive' : 'active';
        }
      }
    }
    */

    //this.verticalSlides.setElementStyle("visibility", "visible");
    //this.verticalSlides.slideTo(2);

    //this.scroll._scrollContent.nativeElement.scrollLeft = 500;
    //console.log(this.scroll._scrollContent);
    //this.content = this.app.getComponent('my-content');
    //this.content.addScrollEventListener(this.onPageScroll);
    //this.smoothScroll(47,0);
    //console.log(this.content);
    //this.content.scrollToTop();
    //this.content.scrollTo(47,0,200);

    //console.log(this.productSlides.toArray()[0]);
  }

  slideNextDidEnd(event, index: number) {
    this.productSlides.toArray()[index].slideTo(this.productSlides.toArray()[index].getActiveIndex());
  }

  slidePrevDidEnd(event, index: number) {
    this.productSlides.toArray()[index].slideTo(this.productSlides.toArray()[index].getActiveIndex());
  }

  contentScrollHandler(event) {
    //console.log(event);
  }

  contentScrollEnd(event) {
    //console.log(event);

    let step = this.homeContent.contentHeight / 5;
    //console.log(step);
    let adjusted = Math.round(this.homeContent.scrollTop / step) * step
    //console.log(adjusted);

    if (this.homeContent.scrollTop != Math.round(adjusted)) {
      this.homeContent.scrollTo(0, Math.round(adjusted));
    }
  }

  preferenceTapped() {
    this.navCtrl.push(this.preferencePage, {});
  }

  searchTapped() {
    this.navCtrl.push(this.searchPage, {});
  }
  
  //verticalSlideNextDidEnd() {
    //this.verticalSlides.setElementStyle("visibility", "hidden");
  //}

  //verticalSlidePrevDidEnd() {
    //this.verticalSlides.setElementStyle("visibility", "hidden");
  //}

  //setData() {
  //  this.service.setData({ showsTab: false });
  //}

}
