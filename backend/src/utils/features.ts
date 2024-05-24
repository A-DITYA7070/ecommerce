import { myCache } from "../app.js";
import { Product } from "../db/models/product.model.js";
import { OrderItemType } from "../types/order.types.js";
import { invalidateCacheProps } from "../types/other.types.js";
import { Document } from "mongoose";


export const invalidateCache = ({
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

    if(admin){
        const adminKeys : string[] = [
            "admin-stats",
            "admin-pie-charts",
            "admin-bar-charts",
            "admin-line-charts"
        ];

        myCache.del(adminKeys);
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


export const calcuatePercentage = (thisMonth : number,lastMonth : number) => {
    if(lastMonth === 0){
        return thisMonth*100;
    }
    const percentage = (thisMonth / lastMonth) * 100;
    return Number(percentage.toFixed(0));
}


export const getCategories = async(
    { 
        categories,
        productsCount
    } : {
        categories: string[];
        productsCount:number
    }) => {
        const categoriesCountPromise = categories.map((category) => 
            Product.countDocuments({ category })
    );

    const categoriesCount = await Promise.all(categoriesCountPromise);

    const categoryCount: Record<string,number>[] = [];

    categories.forEach((category,i)=>{
        categoryCount.push({
            [category]: Math.round((categoriesCount[i] / productsCount) * 100),
        });
    });

    return categoryCount;
}

export interface MyDocument extends Document {
    createdAt: Date;
    discount ?: number;
    total ?: number;
}

type funcProps = {
    length: number;
    docArr: MyDocument[];
    today: Date;
    property?: "discount" | "total";
}

export const getChartData = ({
    length,
    docArr,
    today,
    property
}: funcProps): number[] => {
    const data: number[] = new Array(length).fill(0);

    docArr.forEach((i) => {
        const creationDate = i.createdAt;

        // Calculate the month difference considering year differences
        const yearDiff = today.getFullYear() - creationDate.getFullYear();
        const monthDiff = yearDiff * 12 + today.getMonth() - creationDate.getMonth();

        // Check if the monthDiff is within the required range
        if (monthDiff < length) {
            data[length - monthDiff - 1] += property && i[property as keyof MyDocument] ? (i[property as keyof MyDocument] as number) : 1;
        }
    });

    return data;
}

