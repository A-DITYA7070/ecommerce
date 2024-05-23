import { myCache } from "../app.js";
import { Product } from "../db/models/product.model.js";
import { OrderItemType } from "../types/order.types.js";
import { invalidateCacheProps } from "../types/other.types.js";


export const invalidateCache = async ({
    product,
    order,
    admin,
    userId,
    orderId,
    productId,
    coupon,
    couponId
} : invalidateCacheProps) => {
    if(product){
        const productKeys : string[] = [
            "latest-products",
            "categories",
            "products",
            "all-products",
            `product-${productId}`
        ];

        if(typeof productId === "string"){
            productKeys.push(`product-${productId}`);
        }

        if(typeof productId === "object"){
            productId.forEach((ele) => {
                productKeys.push(`product-${ele}`);
            })
        }

        myCache.del(productKeys);

    }

    if(order){
        const orderKeys : string[] = [
            "all-orders",
            `my-orders-${userId}`,
            `order-${orderId}`,
        ];

        myCache.del(orderKeys);

    }

    if(coupon){
        const couponKeys : string[] = [
            "discount",
            "all-coupons",
            `coupon-${couponId}`,
        ];

        myCache.del(couponKeys);
    }
}


export const reduceStock = async (orderItems:OrderItemType[]) => {
    for(let i=0;i<orderItems.length;i++){
        const order = orderItems[i];
        const product = await Product.findById(order.productId);
        if(!product){
            throw new Error("Product not found");
        }
        product.stock -= order.quantity;
        await product.save();
    }
}