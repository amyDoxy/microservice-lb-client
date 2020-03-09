import { Component, OnInit } from '@angular/core';
import { OrderHeader } from "./dto/order-header";
import { OrderService } from './order.service';
import { Router, ActivatedRoute, Params } from "@angular/router";
import { routerTransition } from '../../router.animations';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  animations: [routerTransition()]
})
export class OrderComponent implements OnInit {

  allOrders: Array<OrderHeader> = null;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
      this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe(
               (res:Array<OrderHeader>) => { this.allOrders = res },
               error => {
                   console.log( error.data.message );
               }
           );
  }

  onOrderDetail( order ) {
    this.router.navigate( ['order', order.dPk], { relativeTo: this.route } );
}
}
