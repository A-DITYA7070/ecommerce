import { nextTick } from "process";
import { myCache } from "../app.js";
import { Product } from "../db/models/product.model.js";
import { OrderItemType } from "../types/order.types.js";
import { invalidateCacheProps } from "../types/other.types.js";


export const invalidateCache = async ({
    product,
    order,
    admin
} : invalidateCacheProps) => {
    if(product){
        const productKeys : string[] = [
            "latest-products",
            "categories",
            "products",
            "all-products",

        ];

        const products = await Product.find({}).select("_id");

        products.forEach(element => {
            productKeys.push(`product-${element._id}`);
        });

        myCache.del(productKeys);

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