import { Product } from "./Product";

export interface CartItem extends Product {
  quantity: number;
  amount: number;
  cartId: string;
}

export interface CartType {
  items: CartItem[];
  totalAmount: number;
  totalQuantity: number;
  isSideCartVisible: boolean;
  shippingFee: number;
  cartId: string;
}
