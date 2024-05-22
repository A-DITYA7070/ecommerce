import { NextFunction,Request,Response } from "express";
import { catchAsyncError } from "../middlewares/error.js";



/**
 * Controller function to create new order
 */
const newOrder = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{

});




export {
   newOrder,
}