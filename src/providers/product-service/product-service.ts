import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
/*
  Generated class for the ProductServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProductServiceProvider {

  mobileToken:string = "Bearer cj5tfwqlhebgr3gpr45d2ukp20nt063f";  
  //apiBase:string = "http://ec2-13-126-157-140.ap-south-1.compute.amazonaws.com/dcost/rest/V1/"; //2.1
  apiBase:string = "http://ec2-35-154-79-111.ap-south-1.compute.amazonaws.com/dcost/rest/V1/"; //2.2
  authorization:any;

  constructor(public http: HttpClient) {
    console.log('Hello ProductServiceProvider Provider');
    this.authorization = {
      headers: { 
        'Authorization':this.mobileToken 
      }
    }
  }

  /*
  getAttributeSetList() {
    //var tokenHeaders = new HttpHeaders();
    //tokenHeaders.set('Authorization', "Bearer vo65opsqubcdqls2ak421746yq11qel3");
    //console.log(tokenHeaders);
    //categories/attributes?searchCriteria
    //products/attribute-sets/sets/list?searchCriteria

    return new Promise((resolve, reject) => {
      this.http.get(this.apiBase + 'products/attributes?searchCriteria', this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }
  */

  getAttributeList(id: any) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBase +'products/attribute-sets/' + id + '/attributes', this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  getProductDetail(sku: string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBase +'products/' + sku, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  getProductImage(sku: string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBase +'products/' + sku + '/media', this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  getProductAttributeOption(attributeCode: string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBase +'products/attributes/' + attributeCode + '/options', this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  getConfigurableProductOption(sku: string) {    
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBase +'configurable-products/' + sku + '/options/all', this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  getConfigurableProductChildren(sku: string) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBase +'configurable-products/' + sku + '/children', this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

 /*
  *
  */
  getCategoryList() {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBase + 'categories', this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }
  
  getCategory(id:any) {
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBase +'categories/' + id, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  getCategoryProductList(id:number) {
    //women/Jackets = 14
    return new Promise((resolve, reject) => {
      this.http.get(this.apiBase + 'categories/' + id + '/products', this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  searchProductList(categoryID:number, currentPage:number, numberPerPage:number) {
    //category
    var categoryFilter:string = 
    "searchCriteria[filter_groups][0][filters][0][field]=category_id" + 
    "&searchCriteria[filter_groups][0][filters][0][value]=" + categoryID + 
    "&searchCriteria[filter_groups][0][filters][0][condition_type]=eq";
    
    var pageFilter:string = 
    "&searchCriteria[current_page]=" + currentPage + 
    "&searchCriteria[page_size]=" + numberPerPage;

    var configureFilter:string = 
    "&searchCriteria[filter_groups][1][filters][0][field]=type_id" + 
    "&searchCriteria[filter_groups][1][filters][0][value]=configurable" + 
    "&searchCriteria[filter_groups][1][filters][0][condition_type]=eq";

    var combinedFilter:string = categoryFilter + configureFilter + pageFilter;

    return new Promise((resolve, reject) => {
      this.http.get(this.apiBase +'products?' + combinedFilter, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  searchProductWithKeyword(keyword:string, categoryID:string) {

    var combinedFilter:string = "";

    var configureFilter:string = 
    "searchCriteria[filter_groups][0][filters][0][field]=type_id" + 
    "&searchCriteria[filter_groups][0][filters][0][value]=configurable" + 
    "&searchCriteria[filter_groups][0][filters][0][condition_type]=eq";

    var nameFilter:string =
    "&searchCriteria[filter_groups][1][filters][0][field]=name" + 
    "&searchCriteria[filter_groups][1][filters][0][value]=%25" + keyword + "%25" +
    "&searchCriteria[filter_groups][1][filters][0][condition_type]=like";

    var categoryFilter:string =
    "&searchCriteria[filter_groups][2][filters][0][field]=category_id" + 
    "&searchCriteria[filter_groups][2][filters][0][value]=" + categoryID +
    "&searchCriteria[filter_groups][2][filters][0][condition_type]=eq";

    //pagination
    var pageFilter:string = 
    "&searchCriteria[current_page]=1" +
    "&searchCriteria[page_size]=10";

    combinedFilter = configureFilter + nameFilter + categoryFilter + pageFilter;

    return new Promise((resolve, reject) => {
      this.http.get(this.apiBase +'products?' + combinedFilter, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  searchProductWithFilters(filterList:any, categoryID:string, lowerPrice:string, upperPrice:string, sortingType:string, keyword:string, currentPage:number, numberPerPage:number) {
    var configureFilter:string = 
    "searchCriteria[filter_groups][0][filters][0][field]=type_id" + 
    "&searchCriteria[filter_groups][0][filters][0][value]=configurable" + 
    "&searchCriteria[filter_groups][0][filters][0][condition_type]=eq";

    var filterCount:number = 1;

    // attribute filter
    var attributeFilter:string = "";
    for (var i = 0; i < filterList.length; i++) {
      var optionList:string = "";

      for (var j = 0; j < filterList[i].options.length; j++) {
        if (filterList[i].options[j].selected) {
          if (optionList == "") {
            optionList += filterList[i].options[j].value;
          }
          else {
            optionList += "," + filterList[i].options[j].value;
          }
        }
      }

      if (optionList != "") {
        attributeFilter +=
        "&searchCriteria[filter_groups][" + filterCount + "][filters][0][field]=" + filterList[i].attribute_code +
        "&searchCriteria[filter_groups][" + filterCount + "][filters][0][value]=" + optionList +
        "&searchCriteria[filter_groups][" + filterCount + "][filters][0][condition_type]=in";

        filterCount += 1;
      }
    }

    //category filter
    var categoryFilter:string = "";
    if (categoryID != "") {
      categoryFilter =
      "&searchCriteria[filter_groups][" + filterCount + "][filters][0][field]=category_id" +
      "&searchCriteria[filter_groups][" + filterCount + "][filters][0][value]=" + categoryID +
      "&searchCriteria[filter_groups][" + filterCount + "][filters][0][condition_type]=eq";
      filterCount += 1;
    }

    //price filter
    var priceFilter:string = "";

    if (lowerPrice != "") {
      priceFilter +=
      "&searchCriteria[filter_groups][" + filterCount + "][filters][0][field]=price" +
      "&searchCriteria[filter_groups][" + filterCount + "][filters][0][value]=" + lowerPrice +
      "&searchCriteria[filter_groups][" + filterCount + "][filters][0][condition_type]=gteq";
      filterCount += 1;
    }

    if (upperPrice != "") {
      priceFilter +=
      "&searchCriteria[filter_groups][" + filterCount + "][filters][0][field]=price" +
      "&searchCriteria[filter_groups][" + filterCount + "][filters][0][value]=" + upperPrice +
      "&searchCriteria[filter_groups][" + filterCount + "][filters][0][condition_type]=lteq";
      filterCount += 1;
    }

    //keyword filter
    var keywordFilter:string = "";
    if (keyword != "") {
      keywordFilter =
      "&searchCriteria[filter_groups][" + filterCount + "][filters][0][field]=name" +
      "&searchCriteria[filter_groups][" + filterCount + "][filters][0][value]=%25" + keyword + "%25" +
      "&searchCriteria[filter_groups][" + filterCount + "][filters][0][condition_type]=like";
      filterCount += 1;
    }

    var sortingFilter:string = "";  
    if (sortingType == "priceUp") {
      sortingFilter += 
      "&searchCriteria[sortOrders][0][field]=price" +
      "&searchCriteria[sortOrders][0][direction]=ASC"
    }
    else if (sortingType == "priceDown") {
      sortingFilter += 
      "&searchCriteria[sortOrders][0][field]=price" +
      "&searchCriteria[sortOrders][0][direction]=DESC"
    }
    else {

    }

    //pagination
    var pageFilter:string = 
    "&searchCriteria[current_page]=" + currentPage +
    "&searchCriteria[page_size]=" + numberPerPage;

    var combinedFilter:string = configureFilter + categoryFilter + attributeFilter + priceFilter + sortingFilter + keywordFilter + pageFilter;

    return new Promise((resolve, reject) => {
      this.http.get(this.apiBase +'products?' + combinedFilter, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }

  searchParentProduct(name: string, sku: string) {
    var pageFilter = "searchCriteria[current_page]=1" 
    "&searchCriteria[page_size]=1";

    var nameFilter = "&searchCriteria[filter_groups][0][filters][0][field]=name" + 
    "&searchCriteria[filter_groups][0][filters][0][value]=" + name +
    "&searchCriteria[filter_groups][0][filters][0][condition_type]=eq";

    var typeFilter = "&searchCriteria[filter_groups][1][filters][0][field]=type_id" +
    "&searchCriteria[filter_groups][1][filters][0][value]=configurable" +
    "&searchCriteria[filter_groups][1][filters][0][condition_type]=eq";

    var skuFilter = "&searchCriteria[filter_groups][2][filters][0][field]=sku" +
    "&searchCriteria[filter_groups][2][filters][0][value]=" + sku + "%25" +
    "&searchCriteria[filter_groups][2][filters][0][condition_type]=like";

    var combinedFilter:string = pageFilter + nameFilter + typeFilter + skuFilter;

    return new Promise((resolve, reject) => {
      this.http.get(this.apiBase +'products?' + combinedFilter, this.authorization)
      .subscribe(data => {
        resolve(data);
      }, err => {
        reject(err);
      })
    })
  }
}
