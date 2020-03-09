import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { OrderService } from '../order.service';
import { Order } from "../dto/order";
import { OrderHeader } from "../dto/order-header";
import { OrderLine } from "../dto/order-line";
import { Customer } from '../dto/customer';
import { Organization } from '../dto/organization';
import { Item } from '../dto/item';
import { Subscription, Observable } from "rxjs";
import { switchMap, map } from 'rxjs/operators';
import {forkJoin} from 'rxjs';
import { routerTransition } from '../../../router.animations';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  animations: [routerTransition()]
})
export class OrderDetailComponent implements OnInit {

  selectedOrder: OrderHeader;
  selectedOrderLines: Array<OrderLine>;
  newOrderLine: OrderLine = new OrderLine();
  customers: Array<Customer>;
  organizations: Array<Organization>;
  items: Array<Item>;
  clicked = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) { }

  ngOnInit() {
    this.route.params.pipe(switchMap(( params: Params ) => {
                return forkJoin(
                  this.getOrder( +params['id'] ),
                  this.getOrderLinesByHeader( +params['id'] ),
                  this.orderService.getListOfCustomers(),
                  this.orderService.getAllOrganizations()
                 );
            } )).subscribe(( data: any[] ) => {
                this.setOrder( data[0] );
                this.setOrderLines(data[1]);
                this.setCustomers(data[2]);
                this.setOrgs(data[3]);
            },
            error => {
                console.log( [error.data.message] );
            } );
  }


  getOrder( dPk: number): Observable<OrderHeader>{
    if(dPk) {
     return  this.orderService.getOrder(dPk);
    }
    return null;
  }
  setOrgs(orgs:  Array<Organization>){
    this.organizations = orgs.map( org => {
      org.name = org.organizationCode + ' \t '+ org.name;
        return org;
    });
  }

  setCustomers(custs: Array<Customer>){
    this.customers = custs.map(cust=>{
      cust.custName = cust.custNumber + ' \t '+ cust.custName;
      return cust;
    });
  }

  getOrderLinesByHeader( header: number): Observable<Array<OrderLine>> {
    if(header) {
      return this.orderService.getOrderLinesByHeader(header);
    }return null;
  }

  setOrder( order:OrderHeader){
    this.selectedOrder = order;
    let orgCode = order.inventoryOrgCode;
    this.setItemsByOrgCode(orgCode);

  }
  setOrderLines( lines: Array<OrderLine>) {
    this.selectedOrderLines = lines;
  }
  resetNewOrderLine(){
    this.newOrderLine = new OrderLine();
  }

  onAddLine(){
    this.clicked= true;
    if(this.newOrderLine.qty && this.newOrderLine.itemNumber){
      let order = new Order();
      order.orderHeader = this.selectedOrder;
      order.orderLines = this.newOrderLine;
      this.orderService.addOrderLine(order).subscribe((data: any)=>{
        this.getOrderLinesByHeader( data.dPk ).subscribe((res:any)=>{
          this.setOrderLines(res);
          this.resetNewOrderLine();
          this.clicked = false;
        });
      });
    }else{
      console.log("Qty or Item should not be empty");
        this.clicked = false;
        console.log(this.clicked);
    }

  }

  onDeleteLine(line: OrderLine){
    let orderHdrId = line.orderHeaderId;
    this.orderService.deleteLine(line.dPk).subscribe(()=>{
      if(orderHdrId) {
        this.getOrderLinesByHeader( orderHdrId ).subscribe((res:any)=>{
          this.setOrderLines(res);
        });
      }
    });
  }

  setItemsByOrgCode(orgCode){
     this.orderService.getItemsByOrgCode(orgCode).subscribe(( data: any ) => {
         this.items = data.map(it=>{
           it.description = it.itemNumber + ' \t ' + it.description;
           return it;
         });
     },
     error => {
         console.log( [error.data.message] );
     } );
  }

  onOrgCodeChange(){
    this.setItemsByOrgCode(this.selectedOrder.inventoryOrgCode);
  }

  onCustomerChange(){
     this.orderService.getCustomerByNumber(this.selectedOrder.customerNumber).subscribe(( data: any ) => {
         this.selectedOrder.billToAddress1 = data.billToAddress;
         this.selectedOrder.shipToAddress1 = data.shipToAddress;
         this.selectedOrder.customerName = data.custName;
     },
     error => {
         console.log( [error.data.message] );
     } );

  }

  onItemChange(){
    this.orderService.getItemByNumber(this.newOrderLine.itemNumber).subscribe(( data: any ) => {
        this.newOrderLine.itemName = data.description;
    },
    error => {
        console.log( [error.data.message] );
    } );
  }
}
