import { myCache } from "../app.js";
import { Product } from "../db/models/product.model.js";
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