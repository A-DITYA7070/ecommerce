import mongoose,{Schema} from "mongoose";

const orderSchema = new Schema({
    shippingInfo:{
        address:{
            type:String,
            required:[true,"Address is required"]
        },
        city:{
            type:String,
            required:[true,"City is required"]
        },
        state:{
            type:String,
            required:[true,"state is required"]
        },
        country:{
            type:String,
            required:[true,"Country is required"]
        },
        pincode:{
            type:Number,
            required:[true,"pincode is required"]
        }
    },
    user:{
        type:String,
        ref:"User",
        required:true
    },
    subtotal:{
        type:Number,
        required:true
    },
    tax:{
        type:Number,
        required:true
    },
    shippingCharges:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    total:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:["PROCESSING","SHIPPED","DELIVERED"],
        default:"PROCESSING"
    },
    orderItems:[
        {
            name:String,
            photo:String,
            price:Number,
            quantity:Number,
            productId:{
                type:mongoose.Types.ObjectId,
                ref:"Product"
            }
        }
    ]
},{
    timestamps:true
});


export const Order = mongoose.model("Order",orderSchema);