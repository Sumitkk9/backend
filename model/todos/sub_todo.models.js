import mongoose from "mongoose";

const subTodoScheme = new mongoose.Schema({
    content:{
        type:String,
        required:true
    }
},{timestamps:true})

export const subTodo = mongoose.model("SubTodo",subTodoScheme)