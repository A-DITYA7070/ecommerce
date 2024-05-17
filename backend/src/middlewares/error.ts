import { NextFunction,Request,Response } from "express";
import ErrorHandler from "../utils/utility-class.js";



export const errorMiddleWare = (
    
    err:ErrorHandler,
    req:Request,
    res:Response,
    next:NextFunction

)=>{
    
    err.message = err.message || "Internal server error ";
    err.statusCode = err.statusCode || 500;

    return res.status(err.statusCode)
    .json({
        success:false,
        message:err.message
    })
}