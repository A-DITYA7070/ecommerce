import mongoose from "mongoose";
import validator from "validator";


interface IUser extends Document{
    _id:string;
    name:string;
    photo:string;
    email:string;
    role:"admin"| "user";
    gender:"male"|"female";
    dob: Date;
    createdAt:Date;
    updateAt:Date;
    // virtual attribute
    age:number;
}


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
    const dob = this.dob;
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