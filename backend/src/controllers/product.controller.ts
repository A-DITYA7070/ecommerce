import { NextFunction,Request,Response } from "express";
import { Product } from "../db/models/product.model.js";
import { catchAsyncError } from "../middlewares/error.js";
import { NewProductRequestBody, SearchRequestQuery, baseQuery } from "../types/product.types.js";
import ErrorHandler from "../utils/utility-class.js";
import { rm } from "fs";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

/**
 * Controller function to create new Product.
 */
const newProduct = catchAsyncError(async(
    req:Request<{},{},NewProductRequestBody>,
    res:Response,
    next:NextFunction
    )=>{
    const {
        name,
        category,
        stock,
        price,
    } = req.body;

    const photo = req.file;

    if(!photo){
        return next(new ErrorHandler("Bad request",400));
    }

    if(!name || !category || !stock || !price){
        rm(photo.path,()=>{
            console.log("deleted");
        });
        return next(new ErrorHandler("Bad request",400));
    }

    let product = await Product.create({
        name,
        price,
        category:category.toLowerCase(),
        stock,
        photo:photo?.path,
    });

    invalidateCache({
        product:true,
        admin:true,
        productId:String(product._id)
    });

    return res.status(201)
    .json({
        success:true,
        product
    })
});

/**
 * Controller function to get all products from the db
 */
const getProducts = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    let products;
    if(myCache.has("products")){
        products = JSON.parse(myCache.get("products") as string);
    }else{
        products = await Product.find({});
        myCache.set("products",JSON.stringify(products));
    }
    res.status(200)
    .json({
        success:true,
        products
    });
});

/**
 * Controller function to get latest product.
 * caching is implemented using NodeCache.
 */
const getLatestProducts = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {

    let products;

    if(myCache.has("latest-products")) {
        products = JSON.parse(myCache.get("latest-products") as string);
    }else{
        products = await Product
        .find({})
        .sort({createdAt:-1})
        .limit(5);

        myCache.set("latest-products",JSON.stringify(products));
    }

    // revalidate on new update or delete product and new order.
 
    res.status(200)
    .json({
        success:true,
        products
    });
});

/**
 * Controller function to get all categories
 */
const getAllCategories = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {

    let categories;

    if(myCache.has("categories")){
        categories = JSON.parse(myCache.get("categories") as string);
    }else{
        categories = await Product.distinct("category");
        myCache.set("categories",JSON.stringify(categories));
    }

    return res.status(200)
    .json({
        success:true,
        categories
    });
});

/**
 * Controller function to get admin products.
 */
const getAdminProducts = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {

    let products;

    if(myCache.has("all-products")){
        products = JSON.parse(myCache.get("all-products") as string)
    }else{
        products = await Product.find({});
        myCache.set("all-products",JSON.stringify(products));
    }

    res.status(200)
    .json({
        success:true,
        products
    });
});

/**
 * controller function to get single product.
 */
const getProductDetails = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad request",400));
    }
    
    let product;

    if(myCache.has(`product-${id}`)){
        product = JSON.parse(myCache.get(`product-${id}`) as string)
    }else{
        product = await Product.findById(id);
        if(!product){
            return next(new ErrorHandler("Product Not found",404));
        }

        myCache.set(`product-${id}`,JSON.stringify(product));
    }
    
    res.status(200)
    .json({
        success:true,
        product
    });
});

/**
 * Controller function to update product
 */
const updateProduct = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const id = req.params.id;

    if(!id){
        return next(new ErrorHandler("Bad request",400));
    }

    const {name,price,stock,category} = req.body;
    const photo = req.file;
    
    if(!name && !price && !stock && !category && !photo){
        return next(new ErrorHandler("Please enter atleast one field to update",400));
    }

    const product = await Product.findById(id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    if(photo){
        rm(product.photo!,()=>{
           console.log("Old photo deleted");
        });
        product.photo = photo.path;
    }

    if(name){
        product.name = name;
    }

    if(price){
        product.price = price;
    }

    if(category){
        product.category = category;
    }

    if(stock){
        product.stock = stock;
    }

    await product.save();

    invalidateCache({
        product:true,
        admin:true,
        productId:String(product._id)
    });

    res.status(200)
    .json({
        success:true,
        message:"Product updated successfully"
    });
});

/**
 * Controller function to delete product.
 */
const deleteProduct = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad request",400));
    }
    const product = await Product.findById(id);
    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    rm(product.photo!,()=>{
        console.log("Photo deleted");
    });

    await product.deleteOne();

    invalidateCache({
        product:true,
        admin:true,
        productId:String(product._id)
    });
    
    res.status(200)
    .json({
        success:true,
        message:"Product deleted successfully"
    });
});

/**
 * Controller function to search products.
 */
const searchProducts = catchAsyncError(async(
    req:Request<{},{},{},SearchRequestQuery>,
    res:Response,
    next:NextFunction
) => {

    const {
        search,
        sort,
        category,
        price
    } = req.query;

    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 5;
    const skip = (page - 1) * limit;
    
    const baseQuery : baseQuery = {};

    if(search){
        baseQuery.name = {
            $regex:search,
            $options:"i"
        }
    };

    if(price){
        baseQuery.price = {
            $lte: Number(price)
        }
    };

    if(category){
        baseQuery.category = category;
    };

    const productsPromise =  Product.find(baseQuery)
    .sort(
        sort && { price:sort === "asc" ? 1 : -1 }
    ).limit(limit).skip(skip);

    const filteredProductPromise = Product.find(baseQuery);

    const [products,filteredOnlyProducts] = await Promise.all([ productsPromise,filteredProductPromise]);

    const totalPage = Math.ceil(filteredOnlyProducts.length / limit);

    res.status(200)
    .json({
        success:true,
        products,
        totalPage
    });
});




export {
    getProducts,
    newProduct,
    getLatestProducts,
    getAllCategories,
    getAdminProducts,
    getProductDetails,
    updateProduct,
    deleteProduct,
    searchProducts
}