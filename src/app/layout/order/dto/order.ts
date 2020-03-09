import { OrderHeader } from "./order-header";
import { OrderLine } from "./order-line";

export class Order{
  orderHeader?: OrderHeader;
  orderLines?: OrderLine;

  constructor(){}
}
