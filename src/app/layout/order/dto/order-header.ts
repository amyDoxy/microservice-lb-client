import { OrderLine } from "./order-line";

export class OrderHeader {

  dPk?: number;
  sourceOrderNum?: string;
  orderNum?: string;
  orderDate?: any;
  customerNumber?: string;
  customerName?: string;
  billToAddress1?: string;
  shipToAddress1?: string;
  customerPoNum?: string;
  inventoryOrgCode?: string;
  orderStatus?: string;
  organizationName?: string;
  orderLines?: Array<OrderLine>;


  constructor(){

  }
}
