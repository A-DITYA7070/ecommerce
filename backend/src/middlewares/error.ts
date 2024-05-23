import { NextFunction,Request,Response } from "express";
import ErrorHandler from "../utils/utility-class.js";
import { ControllerType } from "../types/other.types.js";


/**
 * @param err Errors (user defined,custom error)
 * @param req Request 
 * @param res Response
 * @param next Next function
 * @returns status code and message
 * Middleware function to pass custom error and statuscode.
 */
export const errorMiddleWare = (
    
    err:ErrorHandler,
    req:Request,
    res:Response,
    next:NextFunction

)=>{
    
    err.message = err.message || "Internal server error ";
    err.statusCode = err.statusCode || 500;

    if(err.name === "CastError"){
        err.message = "Invalid Id"
    }

    return res.status(err.statusCode)
    .json({
        success:false,
        message:err.message
    })
}

/**
 * 
 * @param func to resolve promise of the function passed 
 * @returns Promise
 * It is useful because we will not have to write try catch block repeatadlly
 */
export const catchAsyncError = (func:ControllerType) => (req:Request,res:Response,next:NextFunction) => {
    return Promise.resolve(func(req,res,next)).catch(next);
}