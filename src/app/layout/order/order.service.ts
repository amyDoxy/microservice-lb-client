import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { Order } from './dto/order';
import { OrderHeader } from './dto/order-header';
import { OrderLine } from './dto/order-line';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private orders: any;
  // private baseUrl: any = 'https://luxtestjcs-luxadmin.gbcom-south-1.oraclecloud.com/payroll-admin';
  // private baseUrl: any = 'http://localhost:8086/payroll-admin';
  private baseUrl: any = 'http://localhost:3000/api';
  private url: string;
  constructor(private httpClient: HttpClient) {
  }
  buildUrl(urlExtension: any) {
     this.url = this.baseUrl + '/OrderHeaders';
    if (urlExtension) {
      this.url += '/' + urlExtension;
    }
    return  this.url;
  }

  addTokenToHeader() {
    const token = sessionStorage.getItem('jwtToken');
    let headers = new HttpHeaders();
    headers = headers.set('Authorization', 'Bearer ' + token);
    return headers;
  }
  getOrders() {

    return this.httpClient.get(this.buildUrl(null),  { headers: this.addTokenToHeader() });
  }

  getOrder(dPk: Number) {
    return this.httpClient.get(this.buildUrl(dPk),  { headers: this.addTokenToHeader() });
  }

  getOrderLinesByHeader( header: number): Observable<OrderLine[]> {
      return this.httpClient.get<OrderLine[]>(this.buildUrl ( 'lines?header=' + header),  { headers: this.addTokenToHeader() });
  }

  getListOfCustomers() {
    return this.httpClient.get(this.buildUrl('customers'),  { headers: this.addTokenToHeader() });
  }

  getCustomerByNumber(custNum: any) {
    return this.httpClient.get(this.buildUrl('customers/' + custNum),  { headers: this.addTokenToHeader() });
  }

  getAllOrganizations() {
    return this.httpClient.get(this.buildUrl('orgs'),  { headers: this.addTokenToHeader() });
  }

  getItemsByOrgCode(orgCode: string) {
    return this.httpClient.get(this.buildUrl('items?orgCode=' + orgCode),  { headers: this.addTokenToHeader() });
  }

  getItemByNumber(itemNum: any) {
    return this.httpClient.get(this.buildUrl('items/' + itemNum),  { headers: this.addTokenToHeader() });
  }

  addOrderLine(order: Order) {
    return this.httpClient.post<OrderHeader>(this.buildUrl(null), order,  { headers: this.addTokenToHeader() });
  }

  deleteLine(lineId: number) {
    return this.httpClient.delete(this.buildUrl('lines/' + lineId),  { headers: this.addTokenToHeader() });
  }


}
