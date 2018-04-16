import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { MySharedServiceProvider } from '../my-shared-service/my-shared-service';
/*
  Generated class for the ShoppingCartServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ShoppingCartServiceProvider {

  apiBase:string = "http://ec2-35-154-79-111.ap-south-1.compute.amazonaws.com/dcost/rest/V1/";
  authorization:any;

  constructor(public http: HttpClient, 
    private storage: Storage, 
    public sharedService: MySharedServiceProvider) {
    console.log('Hello ShoppingCartServiceProvider Provider');
    //console.log(this.sharedService.privateToken);
    this.authorization = {
      headers: { 
        'Authorization':this.sharedService.privateToken 
      }
    }
  }

  createCart() {
    return new Promise((resolve, reject) => {
      this.http.post(this.apiBase + 'carts/mine', {}, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  getCart() {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBase + 'carts/mine', this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  addSimpleToCart(quoteID:string, quantity:number, sku:string) {
    let body = {
      "cartItem": {
        "sku": sku,
        "qty": quantity,
        "quote_id": quoteID
      }
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.apiBase + 'carts/mine/items', body, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  addConfigurableToCart(quoteID:string, quantity:number, sku:string, options:any) {

    let body = {
      "cartItem": {
        "sku": sku,
        "qty": quantity,
        "quote_id": quoteID,
        "product_option": {
          "extension_attributes": {
            "configurable_item_options": options
          }
        },
        "extension_attributes": {}
      }
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.apiBase + 'carts/mine/items', body, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  removeProductFromCart(itemID:string) {
    return new Promise((resolve, reject) => {
      this.http.delete(this.apiBase + 'carts/mine/items/' + itemID, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    });
  }

  updateCart(product:any, quantity:number) {
    let quoteID = product.quote_id;
    let itemID = product.item_id ;
    //let qty = product.qty;

    let body = {
      "cartItem": {
        "item_id": itemID, 
        "qty": quantity, 
        "quote_id": quoteID
      }
    }

    return new Promise((resolve, reject) => {
      this.http.put(this.apiBase + 'carts/mine/items/' + itemID, body, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    });
  }
  
  getSubtotal() {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBase + 'carts/mine/totals', this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  getShippingEstimation(address:any) {

    return new Promise((resolve, reject) => {
      this.http.post(this.apiBase + 'carts/mine/estimate-shipping-methods', address, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  setShippingInformation(address:any) {

    return new Promise((resolve, reject) => {
      this.http.post(this.apiBase + 'carts/mine/shipping-information', address, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }


  placeOrderOffline(payment:string, address:any) {
    let body = {
      "paymentMethod": {
        "method": payment
      },
      "billing_address": address
    };

    return new Promise((resolve, reject) => {
      this.http.post(this.apiBase + 'carts/mine/payment-information', body, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  placeOrderOnline(payment:string, address:any, nonce:string) {
    let body = {
      "paymentMethod": {
        "method": payment, //"braintree"
        "additional_data": {
          "payment_method_nonce":nonce
        }
      },
      "billing_address": address
    };

    return new Promise((resolve, reject) => {
      this.http.post(this.apiBase + 'carts/mine/payment-information', body, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  /*
  placeOrder(payment:string, address:any, nonce:string) {
    var body:any;

    if (nonce == "") {
      body = {
        "paymentMethod": {
          "method": payment
        },
        "billing_address": address
      };
    }
    else {
      body = {
        "paymentMethod": {
          "method": payment, //"braintree"
          "additional_data": {
            "payment_method_nonce":nonce
          }
        },
        "billing_address": address
      };
    }

    return new Promise((resolve, reject) => {
      this.http.post(this.apiBase + 'carts/mine/payment-information', body, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }
  */
}
