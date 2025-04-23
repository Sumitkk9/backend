import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import mongoose from "mongoose";

const subscribe = asyncHandler(async (req,res)=>{

    const {channelname} = req.params
    if(!channelname?.trim()){
         throw new ApiError(400,"channel id not found in params")
        }
    const sub = await Subscription.create({
        channel: new mongoose.Types.ObjectId(channelname) ,
        subscribedBy:new mongoose.Types.ObjectId(req.user?._id)
    })
    return res
    .status(200)
    .json(new ApiResponse(200,
        sub,
        "Channel subscribed"
    ))
})

const unSubscribe = asyncHandler(async(req,res)=>{

    const {channelname} = req.params
    if(!channelname?.trim()){
        throw new ApiError(400,"channel id not found in params")
       }
    // const user = req.user?._id


 const deletedUser =    await Subscription.findOneAndDelete({
        channel: new mongoose.Types.ObjectId(channelname) ,
        subscribedBy:new mongoose.Types.ObjectId(req.user?._id)
    })

    if(!deletedUser) throw new ApiError(402,"user has not subscribed to this channel")
   
        return res.status(200)
        .json(new ApiResponse(200,
            deletedUser,
            "Channel Unsubscribed"
        ))
})
export {
    subscribe,
    unSubscribe
}