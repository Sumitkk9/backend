import mongoose, { Schema } from "mongoose";

const chatschema = new Schema(
    {
        message:{
            type:String
        },
        photo:{
            type: String
        },
        video:{
            type: String
        },
        document:{
            type: String
        }
        
    },{
        timestamps:true
    }
)

export const Chat = mongoose.model("Chat",chatschema)