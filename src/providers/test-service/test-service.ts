//import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map'; //Needed for http

/*
  Generated class for the TestServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TestServiceProvider {

  //constructor(public http: HttpClient) {
  //  console.log('Hello TestServiceProvider Provider');
  //}

  constructor(public http: Http) {
    console.log('Hello TestService Provider');
  }

  get() {
    return new Promise((resolve, reject) => {
      this.http.get('http://dc_api.diningcity.asia/public/deals?api-key=cgecegcegcc')
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, err => {
          reject(err);
        })
    })
  }


}
