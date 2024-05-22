import { Request,Response,NextFunction } from "express";
import { User } from "../db/models/user.model.js";
import { NewUserRequestBody } from "../types/user.types.js";
import { catchAsyncError } from "../middlewares/error.js";
import ErrorHandler from "../utils/utility-class.js";

/**
 * Controller function to create/register new User 
 */
const newUser = catchAsyncError(async(
    req:Request<{},{},NewUserRequestBody>,
    res:Response,
    next:NextFunction
)=>{
    const {
        name,email,photo,_id,dob,gender
    } = req.body;

    let user = await User.findById(_id);
    if(user){
        return res.status(200)
        .json({
            success:true,
            message:"logged in"
        })
    }

    if(!name || !email || !photo || !_id || !dob || !gender){
        return res.status(400)
        .json({
            success:false,
            message:"Bad request"
        })
    }

    user = await User.create({
        name,email,photo,gender,_id,dob:new Date(dob)
    });

    res.status(201)
    .json({
        success:true,
        user
    })
});

/**
 * Controller function to get all users from db --> make sure to use onlyAdmin middleware.
 */
const getAllUsers = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    const users = await User.find({});
    return res.status(200)
    .json({
        success:true,
        users
    })
});

/**
 * Controller function to get singe user with id.
 */
const getUser = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const id = req.params.id;
    if(!id){
        return res.status(400)
        .json({
            success:false,
            message:"Bad request"
        })
    }
    const user = await User.findById(id);
    if(!user){
        return res.status(404)
        .json({
            success:true,
            message:`user not found`
        })
    }
    res.status(200)
    .json({
        success:true,
        user
    })
});

/**
 * Controller function to delete user -- make sure to user onlyadmin middlewares.
 */
const deleteUser = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const id = req.params.id;
    if(!id){
        return res.status(400)
        .json({
            success:false,
            message:"Bad request"
        })
    }
    const user = await User.findById(id);
    if(!user){
        return next(new ErrorHandler("Not found",404));
    }
    await user.deleteOne();
    res.status(200)
    .json({
        success:true,
        message:"User deleted successfully"
    })
});

/**
 * Controller function to update the user details.
 */
const updateUser = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {
    const id = req.params.id;
    if(!id){
        return next(new ErrorHandler("Bad request",400));
    }
    const {
        name,
        email,
        photo,
        dob,
        gender
    } = req.body;

    if(!name && !email && !photo && !dob && !gender){
        return next(new ErrorHandler("Please enter atleast one field to update",400));
    }

    let user = await User.findById(id);
    if(!user){
        return next(new ErrorHandler("User not found",404));
    }
    if(email)user.email=email;
    if(name)user.name=name;
    if(photo)user.photo=photo;
    if(dob)user.dob=dob;
    if(gender)user.gender=gender;

    await user.save();
    res.status(200)
    .json({
        success:true,
        message:"Details updated"
    });
});



export {
    getAllUsers,
    newUser,
    getUser,
    deleteUser,
    updateUser
}


