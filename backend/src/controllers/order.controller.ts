import { NextFunction,Request,Response } from "express";
import { catchAsyncError } from "../middlewares/error.js";
import { NewOrderRequestBody } from "../types/order.types.js";
import { Order } from "../db/models/order.model.js";
import { invalidateCache, reduceStock } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";
import { myCache } from "../app.js";
import { Product } from "../db/models/product.model.js";



/**
 * Controller function to create new order
 */
const newOrder = catchAsyncError(async(
    req:Request<{},{},NewOrderRequestBody>,
    res:Response,
    next:NextFunction
)=>{

    const {
        shippingInfo,
        orderItems,
        user,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total
    } = req.body;

    if(!shippingInfo || !orderItems || !user || !subtotal || !tax || !total){
        return next(new ErrorHandler("Bad request",400));
    }

    const order = await Order.create({
        shippingInfo,
        orderItems,
        user,
        subtotal,
        tax,
        shippingCharges,
        discount,
        total
    });

    await reduceStock(orderItems);

    invalidateCache({
        product:true,
        order:true,
        admin:true,
        userId:user,
        productId:String(order.orderItems.map(i=>i.productId))
    });


    res.status(201)
    .json({
        success:true,
        message:"order placed successfully"
    });
});

/**
 * Controller function to get logged in users order details.
 */
const myOrderDetails = catchAsyncError( async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const {id:user} = req.params;
    if(!user){
        return next(new ErrorHandler("Bad request",400));
    }

    let orders=[];

    const key = `my-orders-${user}`;

    if(myCache.has(key)){
        orders = JSON.parse(myCache.get(key) as string)
    }else{
        orders = await Order.find({user});
        myCache.set(key,JSON.stringify(orders));
    }

    res.status(200)
    .json({
        success:true,
        orders
    });
});

/**
 * Controller function to get all orders 
 */
const allOrders = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const key = `all-orders`;

    let orders = [];

    if(myCache.has(key)){
        orders = JSON.parse(myCache.get(key) as string);
    }else{
        orders = await Order.find().populate("user","name");
        myCache.set(key,JSON.stringify(orders));
    }

    res.status(200)
    .json({
        success:true,
        orders
    });
});

/**
 * Controller function to get single order details by order id
 */
const getSingleOrderDetails = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const {id} = req.params;

    if(!id){
        return next(new ErrorHandler("Bad request",400));
    }

    const key = `order-${id}`;

    let order;

    if(myCache.has(key)){
       order = JSON.parse(myCache.get(key) as string);
    }else{
        order = await Order.findById(id);
        if(!order){
            return next(new ErrorHandler("Order Not found",404));
        }
        myCache.set(key,JSON.stringify(order));
    }

    res.status(200)
    .json({
        success:true,
        order
    });
});

/**
 * Controller function to process order
 */
const processOrder = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const {id} = req.params;

    if(!id){
        return next(new ErrorHandler("Bad request",400));
    }

    const order = await Order.findById(id);
    if(!order){
        return next(new ErrorHandler("Order not found ",404));
    }

    switch(order.status){
        case "PROCESSING":
            order.status = "SHIPPED";
            break;
        case "SHIPPED":
            order.status = "DELIVERED";
            break;
        default:
            order.status = "DELIVERED";
            break;
    }

    await order.save();

    invalidateCache({
        product:false,
        order:true,
        admin:true,
        userId:order.user,
        orderId:String(order._id),
    });

    res.status(200)
    .json({
        success:true,
        message:"Order processed successfully"
    });
});


/**
 * Controller function to delete order
 */
const deleteOrder = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const {id} = req.params;
    const order = await Order.findById(id);
    if(!order){
        return next(new ErrorHandler("Not found",404));
    }
    await order.deleteOne();

    invalidateCache({
        product:false,
        order:true,
        admin:true,
        userId:order.user,
        orderId:String(order._id),
    });

    res.status(200)
    .json({
        success:true,
        message:"Order deleted successfully"
    });
});


export {
   newOrder,
   myOrderDetails,
   allOrders,
   getSingleOrderDetails,
   processOrder,
   deleteOrder
}