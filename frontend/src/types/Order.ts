import { CartItem } from "./Cart"

export enum OrderStatus {
    Pending = "Pending",
    AwaitingFulfillment = "AwaitingFulfillment",
    AwaitingPayment = "AwaitingPayment"
}

export interface Order {
    id: string,
    userId?: string,
    recipient?: string,
    phoneNumber?: string,
    email?: string,
    address?: string,
    status?: OrderStatus
    orderedItems: CartItem[]
}

export interface OrderUpdate {
    id?: string,
    update: {
        recipient: string,
        phoneNumber: string,
        email: string,
        address: string,
    }
}