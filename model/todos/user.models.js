import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    }, email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },password:{
        type:String,
        required:[true,"please enter password"]
    }
},{timestamps:true})

export const users = mongoose.model("Users",userSchema)