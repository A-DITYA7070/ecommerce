import mongoose,{Schema} from "mongoose";


const productSchema = new Schema({
    name:{
        type:String,
        required:[true,"Name required"]
    },
    photo:{
        type:String,
        required:[true,"Photo is required"]
    },
    price:{
        type:Number,
        required:[true,"Price is required"]
    },
    stock:{
        type:Number,
        required:[true,"stock of the product is required"]
    },
    category:{
        type:String,
        required:[true,"Please enter category"],
        trim:true
    }

},{
    timestamps:true
});


export const Product = mongoose.model("Product",productSchema);