
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
//import { Observable } from 'rxjs/Observable';
//import { Observer } from 'rxjs/Observer';
/*
  Generated class for the MySharedServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MySharedServiceProvider {

  public privateToken:string = "";
  public baseURL:string = "http://ec2-35-154-79-111.ap-south-1.compute.amazonaws.com/dcost/pub/media/catalog/product";
  
  //data: any;
  //dataChange: Observable<any>;
  //dataChangeObserver: Observer<any>;

  constructor(private storage: Storage) {
    console.log('Hello MySharedServiceProvider Provider');
    this.loadToken();

    //this.dataChange = new Observable((observer:Observer<any>) => {
    //  this.dataChangeObserver = observer;
    //});
  }

  loadToken() {
    this.storage.get('privateToken').then((val) => {
      if (val) {
        this.privateToken = 'Bearer ' + val;
      }
    });
  }

  //setData(data:any) {
  //  this.data = data;
  //  this.dataChangeObserver.next(this.data);
  //}
}
