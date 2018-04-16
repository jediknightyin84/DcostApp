import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MySharedServiceProvider } from '../my-shared-service/my-shared-service';

//import { Http } from '@angular/http';
//import 'rxjs/add/operator/map';
//import { Headers, RequestOptions } from '@angular/http';
/*
  Generated class for the UserServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserServiceProvider {
  //apiBase:string = "http://ec2-13-126-157-140.ap-south-1.compute.amazonaws.com/dcost/rest/V1/"; //2.1
  apiBase:string = "http://ec2-35-154-79-111.ap-south-1.compute.amazonaws.com/dcost/rest/V1/"; //2.2
  mobileToken:string = "Bearer cj5tfwqlhebgr3gpr45d2ukp20nt063f";
  authorization:any;
  authorizationPrivate:any;

  constructor(public http: HttpClient, 
    private storage: Storage, 
    public sharedService: MySharedServiceProvider) {
    console.log('Hello UserServiceProvider Provider');

    this.authorization = {
      headers: { 
        'Authorization':this.mobileToken
      }
    }

    this.authorizationPrivate = {
      headers: { 
        'Authorization':this.sharedService.privateToken 
      }
    }
  }
  
  // Login 
  generatePrivateToken(username:string, password:string) {
    let body = {
      "username": username, // "roni_cost@example.com",
      "password": password  //"roni_cost3@example.com" 
    };

    return new Promise((resolve, reject) => {
      this.http.post(this.apiBase + 'integration/customer/token', body, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  // Sign up
  createAccount(firstname:string, lastname:string, email:string, password:string) {
    let body = {
      "customer": {
        "firstname": firstname,
        "lastname": lastname,
        "email": email
      },
      "password": password
    };

    return new Promise((resolve, reject) => {
      this.http.post(this.apiBase + 'customers', body, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  // Account exists
  checkExistingAccount(email:string) {
    let body = {
      "customerEmail": email,
      "websiteId": 1
    };

    return new Promise((resolve, reject) => {
      this.http.post(this.apiBase + 'customers/isEmailAvailable', body, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  // Forgot password
  forgotPassword(email:string) {
    let body = {
      "email": email,
      "template": "email_reset",
      "websiteId": 1
    };

    return new Promise((resolve, reject) => {
      this.http.put(this.apiBase + 'customers/password', body, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  // Get account informations
  getAccount() {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBase + 'customers/me', this.authorizationPrivate)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  changeCustomerName(firstname:string, lastname:string, email:string) {
    let body = {
      "customer": {
        "firstname": firstname,
        "lastname": lastname,
        "email": email,
        "websiteId": 1
      }
    };

    return new Promise((resolve, reject) => {
      this.http.put(this.apiBase + 'customers/me', body, this.authorizationPrivate)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  changePassword(oldPassword:string, newPassword:string) {
    let body = {
      "currentPassword": oldPassword,
      "newPassword": newPassword
    };

    return new Promise((resolve, reject) => {
      this.http.put(this.apiBase + 'customers/me/password', body, this.authorizationPrivate)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  updateAddress(email:string, firstname:string, lastname:string, addressList:any) {
    let body = {
      "customer": {
        "email": email,
        "firstname": firstname,
        "lastname": lastname,
        "websiteId": 1,
        "addresses": addressList
      }
    };

    return new Promise((resolve, reject) => {
      this.http.put(this.apiBase + 'customers/me', body, this.authorizationPrivate)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  getOrders(id:string, status:string, currentPage:number, numberPerPage:number) {
    var nameFilter = "searchCriteria[filter_groups][0][filters][0][field]=customer_id" + 
    "&searchCriteria[filter_groups][0][filters][0][value]=" + id +
    "&searchCriteria[filter_groups][0][filters][0][condition_type]=eq";

    var statusFilter:string = "";
    //console.log(status);

    if (status == "all") {
    }
    else if (status == "pending") {
      statusFilter = "&searchCriteria[filter_groups][1][filters][0][field]=status" + 
      "&searchCriteria[filter_groups][1][filters][0][value]=pending,processing" +
      "&searchCriteria[filter_groups][1][filters][0][condition_type]=in";
    }
    else {
      statusFilter = "&searchCriteria[filter_groups][1][filters][0][field]=status" + 
      "&searchCriteria[filter_groups][1][filters][0][value]=pending,processing" +
      "&searchCriteria[filter_groups][1][filters][0][condition_type]=nin";
    }

    var pageFilter = "&searchCriteria[current_page]=" + currentPage + 
    "&searchCriteria[page_size]=" + numberPerPage;

    var combineFilter = nameFilter + statusFilter + pageFilter;

    return new Promise((resolve, reject) => {
      this.http.get(this.apiBase + 'orders?' + combineFilter, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  getOrder(id:string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBase + 'orders/' + id, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  cancelOrder(id:string) {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiBase + 'orders/' + id + '/cancel', {}, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }
}
