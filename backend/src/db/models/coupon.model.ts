import mongoose from "mongoose";


const couponSchema = new mongoose.Schema({
    code:{
        type:String,
        required:[true,"Please enter the coupon code"],
        unique:[true,"Coupon already exists"]
    },
    amount:{
        type:Number,
        required:[true,"Please enter amount"]
    }
},{
    timestamps:true
});


export const Coupon = mongoose.model("Coupon",couponSchema);