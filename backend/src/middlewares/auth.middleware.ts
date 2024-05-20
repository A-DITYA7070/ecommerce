import { NextFunction,Request,Response } from "express";
import { catchAsyncError } from "./error.js";
import ErrorHandler from "../utils/utility-class.js";
import { User } from "../db/models/user.model.js";

/**
 * middleware to authorise admin
 */
export const adminOnly = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const {id} = req.query;
    if(!id)return next(new ErrorHandler("Login to access this resource",401));
    const user = await User.findById(id);
    if(!user){
        return next(new ErrorHandler("Not found",404));
    }
    if(user.role !== "admin"){
        return next(new ErrorHandler("Unauthorised",401));
    }
    next();
})