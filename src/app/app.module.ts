import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { IonicStorageModule } from '@ionic/storage';

import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { AccountPage } from '../pages/account/account';
import { OrderListPage } from '../pages/order-list/order-list';
import { OrderDetailPage } from '../pages/order-detail/order-detail';

import { WishlistPage } from '../pages/wishlist/wishlist';

import { ShoppingCartPage } from '../pages/shopping-cart/shopping-cart';
import { ProductDetailPage } from '../pages/product-detail/product-detail';

import { CategoryListPage } from '../pages/category-list/category-list'; 
import { ProductListPage } from '../pages/product-list/product-list';
import { RandomListPage } from '../pages/random-list/random-list';

import { AddressListPage } from '../pages/address-list/address-list';
import { NewAddressPage } from '../pages/new-address/new-address';
import { CheckoutAddressPage } from '../pages/checkout-address/checkout-address';

import { PaymentListPage } from '../pages/payment-list/payment-list';
import { NewPaymentPage } from '../pages/new-payment/new-payment';
import { CheckoutPaymentPage } from '../pages/checkout-payment/checkout-payment'; 

import { ProfilePage } from '../pages/profile/profile';
import { ChangeNamePage } from '../pages/change-name/change-name';
import { ChangePasswordPage } from '../pages/change-password/change-password';

import { LoginPage } from '../pages/login/login';
import { ForgotPasswordPage } from '../pages/forgot-password/forgot-password';

import { PreferencePage } from '../pages/preference/preference';
import { SearchPage } from '../pages/search/search';
import { ProductInfoPage } from '../pages/product-info/product-info';
import { CheckoutShippingPage } from '../pages/checkout-shipping/checkout-shipping';
import { CheckoutPage } from '../pages/checkout/checkout';
import { CheckoutSuccessPage } from '../pages/checkout-success/checkout-success';
import { TutorialPage } from '../pages/tutorial/tutorial'; 
//import { AboutPage } from '../pages/about/about';
//import { ContactPage } from '../pages/contact/contact';
//import { TestPage } from '../pages/test/test';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
//import { HTTP } from '@ionic-native/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { HammerGestureConfig, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import * as Hammer from 'hammerjs';

import { MySharedServiceProvider } from '../providers/my-shared-service/my-shared-service';
import { UserServiceProvider } from '../providers/user-service/user-service';
import { ProductServiceProvider } from '../providers/product-service/product-service';
import { ShoppingCartServiceProvider } from '../providers/shopping-cart-service/shopping-cart-service';
import { TestServiceProvider } from '../providers/test-service/test-service';

import { LongPressDirective } from '../directives/long-press/long-press';

import { Braintree, ApplePayOptions, PaymentUIOptions } from '@ionic-native/braintree';

export class MyHammerConfig extends HammerGestureConfig  {
  overrides = <any>{
    'swipe': { direction: Hammer.DIRECTION_ALL }, // override default settings
    'press': { enable: true }
  }
}

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    TutorialPage,
    HomePage,
    RandomListPage,
    CategoryListPage,
    ProductListPage,
    ProductDetailPage,
    ProductInfoPage,
    ShoppingCartPage,
    AccountPage,
    OrderListPage,
    OrderDetailPage,
    WishlistPage,
    AddressListPage,
    NewAddressPage,
    CheckoutAddressPage,
    PaymentListPage,
    NewPaymentPage,
    CheckoutPaymentPage,
    ProfilePage,
    ChangeNamePage,
    ChangePasswordPage,
    LoginPage,
    ForgotPasswordPage,
    PreferencePage,
    SearchPage,
    CheckoutPage,
    CheckoutShippingPage,
    CheckoutSuccessPage,
    LongPressDirective
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      // Tabs config
      tabsHideOnSubPages: true,
      // Hide back button text　
      backButtonText: ''
    }),
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    TabsPage,
    TutorialPage,
    HomePage,
    RandomListPage,
    CategoryListPage,
    ProductListPage,
    ProductDetailPage,
    ProductInfoPage,
    ShoppingCartPage,
    AccountPage,
    OrderListPage,
    OrderDetailPage,
    WishlistPage,
    AddressListPage,
    NewAddressPage,
    CheckoutAddressPage,
    PaymentListPage,
    NewPaymentPage,
    CheckoutPaymentPage,
    ProfilePage,
    ChangeNamePage,
    ChangePasswordPage,
    LoginPage,
    ForgotPasswordPage,
    PreferencePage,
    SearchPage,
    CheckoutPage,
    CheckoutSuccessPage,
    CheckoutShippingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    //HTTP,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    { provide: HAMMER_GESTURE_CONFIG, useClass: MyHammerConfig },
    TestServiceProvider,
    MySharedServiceProvider,
    UserServiceProvider,
    ProductServiceProvider,
    ShoppingCartServiceProvider,
    Braintree
  ]
})
export class AppModule {}


