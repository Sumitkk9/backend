import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary,deleteFromCloudinary } from "../utils/cloudinary.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";



const uploadVideo = asyncHandler(async (req,res)=>{

    const {title,description} = req.body

    if(!(title && description)) {
        throw new ApiError(400,"title and description required")
    } 

    const videoLocalPath =  req.files?.video[0]?.path;
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path

    if(!videoLocalPath) throw new ApiError(400,
        "video is required"
    )

    if(!thumbnailLocalPath) throw new ApiError(400,
        "thumbnail is required")

    const videoUrl = await uploadOnCloudinary(videoLocalPath)
    const thumbnailUrl = await uploadOnCloudinary(thumbnailLocalPath)

    if(!videoUrl) throw new ApiError(500,"Error while uploading video to the server")
    if(!thumbnailUrl) throw new ApiError(500,"Error while uploading video to the server")

  const videofile =    await Video.create({
        title,
        description,
        videoFile: videoUrl?.url,
        thumbnail: thumbnailUrl?.url,
        duration: videoUrl?.duration ,
        owner: new mongoose.Types.ObjectId(req.user?._id),
        views:0,
        isPublished: true,
        publicIdCloudinary:videoUrl?.public_id
    })

    return res
    .status(200)
    .json(new ApiResponse(200,
        videofile,
        "Video Successfully Uploaded"
    ))

})

const deleteVideo = asyncHandler(async(req, res)=>{

    const {video} = req.params

    if(!video) throw new ApiError(402, "Id not found")
        
    const deletedVideo = await Video.findOne({
        _id : new mongoose.Types.ObjectId(video),
        owner: new mongoose.Types.ObjectId(req.user?._id)
    })

    const deletedVideoOnCloud= await deleteFromCloudinary(deletedVideo?.publicIdCloudinary)
    console.log(deletedVideoOnCloud)

    const deletedThumbnailOnCloud= await deleteFromCloudinary(deletedVideo?.publicIdCloudinary)
    console.log(deletedThumbnailOnCloud)


    if(!deletedVideo) throw new ApiError(402,"unauthorized request")
    
        return res
    .status(200) 
    .json(new ApiResponse(200,
        deletedVideo,
        "Video Deleted"
    ))


})

export {
    uploadVideo,
    deleteVideo
}