import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose, { set } from "mongoose";
import { title } from "process";

const videos = asyncHandler(async(req,res)=>{

    // const allvideo = await Video.find()
    const allvideo = await Video.aggregate([
                {
                    $match:{}
                },

             {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as: "ownerdetails",
            }   
            
        },
        {
            $addFields:{
                ownerdetails: { "$arrayElemAt": ["$ownerdetails", 0]},
            }
          
        },
        {
            $project:{
                _id:1,
                title:1,
                thumbnail:1,
                isPublished:1,
                duration:1,
                views:1,
                createdAt:1,
                videoFile:1,
                ownerdetails:{
                    _id:1,
                    username:1,
                    avatar:1,
                    fullName:1
                }
            }
        }
    ])

    if(!allvideo) throw new ApiError(404,"No Videos Found" )
     return   res
        .status(200)
        .json(new ApiResponse("200",allvideo,"all video retrieved"))
    
})

const singleVideo = asyncHandler(async (req,res)=>{
    const {videoid} = req.params
    if(!videoid) throw new ApiError(400,"Video Id Is Required")
        const video = await Video.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(videoid)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField: "_id",
                as:"ownerdetails"
            }

        },
        {
            $lookup:{
                from:"subscriptions",
                localField: "owner",
                foreignField: "channel",
                as:"subscriber"
            }

        },
        {
            $addFields: {
              ownerdetails: { "$arrayElemAt": ["$ownerdetails", 0]},
              subscriber: {
                   $size:"$subscriber"
                 
                },
             subscribed:{
                $cond:{
                    if:{$in:[req.user?._id,"$subscriber.subscribedBy"]},
                    then:true,
                    else:false

                }
             }   

            }
          },
       {
        $project:{
            videoFile:1,
            title:1,
            description:1,
            thumbnail:1,
            isPublished:1,
            views:1,
            createdAt:1,
            ownerdetails:{
                _id:1,
                username:1,
                avatar:1,
                coverImage:1,
                fullName:1
                
            },
            subscriber:1,
            subscribed:1
        }
       }
       

    ])

  
        // const video = await Video.findById(videoid).select("-publicIdCloudinary")
        // if(!video) throw new ApiError(404,"Video not found")

            return res
            .status(200)
            .json(new ApiResponse(200,video[0],"video retrieved successfully"))
})

const viewsUpdate = asyncHandler(async(req,res)=>{

    const {videoId} = req.params
    if(!videoId) throw new ApiError(400,"Video is required")
    if(videoId.length>24) throw new ApiError(400,"video id is invalid")

    const video = await Video.findByIdAndUpdate(videoId,  
        { $inc: { views: 1 } },  
        { new: true }  )
    
    if(!video) throw new ApiError(400,"video id is invalid")
    res.status(200)
    .json(new ApiResponse(200,{},"views udpated"))
    })

export {
    videos,
    singleVideo,
    viewsUpdate
}
