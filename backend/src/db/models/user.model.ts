import mongoose from "mongoose";
import validator from "validator";
import { IUser } from "../Interfaces/user.interface.js";


const schema = new mongoose.Schema({
    _id:{
        type:String,
        required:[true,"Please enter id"]
    },
    name:{
        type:String,
        required:[true,"Please enter name"],
    },
    email:{
        type:String,
        required:[true,"Please enter your email "],
        unique:[true,"Email already exists "],
        validate:validator.default.isEmail
    },
    photo:{
        type:String,
        required:[true,"Please add photo"]
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    gender:{
        type:String,
        enum:["male","female"],
        required:[true,"Please enter gender"]
    },
    dob:{
        type:Date,
        required:[true,"Please enter dob"]
    }

},{timestamps:true});

schema.virtual("age").get(function(){
    const today = new Date();
    const dob:Date = this.dob;

    if (!dob || !(dob instanceof Date)) {
        return null;
    }

    let age = today.getFullYear() - dob.getFullYear();

    if(
        today.getMonth() < dob.getMonth() || 
        today.getMonth () === dob.getMonth() &&
        today.getDate() < dob.getDate()
    ){
       age--;
    }
    return age;
});



export const User = mongoose.model<IUser>("User",schema);