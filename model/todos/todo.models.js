import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true,
    }, complete:{
        type:Boolean,
        default:true,
    }, createdBy:{
       type: mongoose.Schema.Types.ObjectId,
       ref: "Users"
    },subTodo:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"SubTodo"
        }  
    ]
},{timestamps:true})

export const todo = mongoose.model('Todo',userSchema)