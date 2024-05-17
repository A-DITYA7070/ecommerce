import { Request,Response,NextFunction } from "express";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";


export const newUser = async(
    req: Request<{},{},NewUserRequestBody>,
    res: Response,
    next: NextFunction
) => {
    try{
        const {
            name,
            email,
            dob,
            photo,
            _id,
            gender  
        } = req.body;

        const user = await User.create({
            name,email,dob:new Date(dob),photo,_id,gender
        });

        res.status(201)
        .json({
            success:true,
            user
        })

    }catch(error){
        res.status(500)
        .json({
            success:false,
            message:"Internal server error"
        })
    }

}