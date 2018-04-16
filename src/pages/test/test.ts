import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { TestServiceProvider } from '../../providers/test-service/test-service'; //need double ../../

/**
 * Generated class for the TestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-test',
  templateUrl: 'test.html',
  providers: [TestServiceProvider]
})
export class TestPage {

  posts: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public http: Http, 
    public service: TestServiceProvider) {

    //'http://dc_api.diningcity.asia/public/deals?api-key=cgecegcegcc'
    //https://www.reddit.com/r/gifs/new/.json?limit=10

    //this.http.get('http://dc_api.diningcity.asia/public/deals?api-key=cgecegcegcc').map(res => res.json()).subscribe(data => {
    //  this.posts = data;
    //  console.log(this.posts);
    //},
    //err => {
    //    console.log("Oops!");
    //});

    this.service.get().then(data => {
      this.posts = data;
      console.log(data);
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TestPage');
  }

}
