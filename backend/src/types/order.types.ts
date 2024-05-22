
export type OrderItemType = {
    name:string;
    photo:string;
    price:number;
    quantity:number;
    productId:string;
}

export type ShippingInfoType = {
    address:string;
    city:string;
    state:string;
    country:string;
    pincode:number
}

export interface NewOrderRequestBody {
    shippingInfo:{};
    user:string;
    subtotal:number;
    tax:number;
    shippingCharges:number;
    discount:number;
    total:number;
    orderItems:OrderItemType[]
};