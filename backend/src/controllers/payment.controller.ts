import { NextFunction,Request,Response, response } from "express";
import { catchAsyncError } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";
import { Coupon } from "../db/models/coupon.model.js";
import { myCache } from "../app.js";
import { invalidateCache } from "../utils/features.js";

/**
 * Controller function to create new Coupon
 */
const newCoupon = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const {
        coupon,
        amount
    } = req.body;

    if(!coupon || !amount){
        return next(new ErrorHandler("Please enter all fields",400));
    }

    await Coupon.create({
        code:coupon,
        amount,
    });

    invalidateCache({coupon:true});

    res.status(201)
    .json({
        success:true,
        message:"Coupon created successfully"
    });
});

/**
 * controller function to apply discount
 */
const applyDiscount = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const {coupon} = req.query;

    if(!coupon){
        return next(new ErrorHandler("Enter all fields",400));
    }

    let discount;

    if(myCache.has("discount")){
        discount = JSON.parse(myCache.get("discount") as string);
    }else{
        discount = await Coupon.findOne({
            code:coupon
        });
    
        if(!discount){
            return next(new ErrorHandler("invalid coupon code",400));
        }
        myCache.set("discount",JSON.stringify(discount));
    }

    res.status(200)
    .json({
        success:true,
        discount:discount.amount
    });
});

/**
 * Controller function to get coupon
 */
const getCoupon = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const {id} = req.params;
    
    let coupon;
    if(myCache.has(`coupon-${id}`)){
        coupon = JSON.parse(myCache.get(`coupon-${id}`) as string);
    }else{
        coupon = await Coupon.findById(id);
        if(!coupon){
            return next(new ErrorHandler("Not found",404));
        }
        myCache.set(`coupon-${id}`,JSON.stringify(coupon));
    }
    res.status(200)
    .json({
        success:true,
        coupon
    });
});

/**
 * Controller function to update coupon 
 */
const updateCoupon = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const {id} = req.params;
    const {
        amount,
        coupon
    } = req.body;

    if(!amount && !coupon){
        return next(new ErrorHandler("Please enter atlease one field",400));
    }

    const c = await Coupon.findById(id);
    if(!c){
        return next(new ErrorHandler("Not found",404));
    }

    if(amount){
        c.amount=amount;
    }

    if(coupon){
       c.code=coupon;
    }

    await c.save();

    await invalidateCache({
        coupon:true,
        couponId:String(c._id)
    })

    res.status(200)
    .json({
        success:true,
        message:"Coupon Updated successfully"
    });
});

/**
 * Controller function to get all coupon
 */
const allCoupons = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {

    let coupons;
    if(myCache.has("all-coupons")){
        coupons = JSON.parse(myCache.get("all-coupons") as string);
    }else{
        coupons = await Coupon.find();
        myCache.set("all-coupons",JSON.stringify(coupons));
    }

    res.status(200)
    .json({
        success:true,
        coupons
    })
});

/**
 * Controller function to delete coupon
 */
const deleteCoupon = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const {id} = req.params;

    const coupon = await Coupon.findById(id);
    if(!coupon){
       return next(new ErrorHandler("Not found",404));
    }

    await coupon.deleteOne();

    invalidateCache({
        coupon:true,
        couponId:String(coupon._id)
    });

    res.status(200)
    .json({
        success:true,
        message:"Coupon deleted successfully"
    });
});



export {
    newCoupon,
    applyDiscount,
    deleteCoupon,
    allCoupons,
    updateCoupon,
    getCoupon
}