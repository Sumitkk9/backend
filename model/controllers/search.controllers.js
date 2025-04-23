import { Video } from "../models/video.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const basicSearch = asyncHandler(async(req,res)=>{

    const {basic} = req.params
    if(!basic) throw new ApiError(400,"Search term is required")
    const result = await Video.find({
        $or: [
            { title: {$regex:basic, $options: "i"}},
            { description: {$regex:basic, $options: "i"}},

        ]

        } )

        const searchResult = await Video.aggregate([
            {
                $match:{
                    $or: [
                        { title: {$regex:basic, $options: "i"}},
                        { description: {$regex:basic, $options: "i"}},
            
                    ]
                }
            },
            {
                $lookup:{
                    from:"users",
                    localField:"owner",
                    foreignField:"_id",
                    as:"ownerdetails"
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
    res.status(200)
    .json(new ApiResponse(200,
        searchResult,
        `showing result for ${basic}`
    ))
})

export {
    basicSearch
}