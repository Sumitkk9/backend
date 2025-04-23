import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from  "../utils/ApiError.js"
import {ApiResponse} from  "../utils/ApiResponse.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import  jwt  from "jsonwebtoken"
import { Chat } from "../models/chat.modal.js"

const newChat = asyncHandler (async(req,res)=>{
    const {message} = req.body
    if(message){
        const result =  await Chat.create({
            message:message
        })
        return res
        .status(200)
        .json(new ApiResponse("200",result,"new Chat added"))
    }

    const chatPhoto = req?.files?.photo
    if(chatPhoto){
        console.log(chatPhoto)
        const photoUrl = await uploadOnCloudinary(chatPhoto[0]?.path)

        const result =  await Chat.create({
            photo:photoUrl.url
        })
        return res
        .status(200)
        .json(new ApiResponse("200",result,"new Chat photo added"))
    }

    const chatVideo= req.files?.video
    if(chatVideo){
        console.log(chatVideo)
        const videoUrl = await uploadOnCloudinary(chatVideo[0]?.path)

        const result =  await Chat.create({
            video:videoUrl.url
        })
        return res
        .status(200)
        .json(new ApiResponse("200",result,"new Chat Video added"))
    }
    
    const chatDocument= req.files?.document
    if(chatDocument){
        console.log(chatDocument)
        const docUrl = await uploadOnCloudinary(chatDocument[0]?.path)

        const result =  await Chat.create({
            document:docUrl.url
        })
        return res
        .status(200)
        .json(new ApiResponse("200",result,"new Chat Doc added"))
    }
   

})


const allChatAdmin = asyncHandler(async(req,res)=>{

    const allChats = await Chat.find()
    
    return res
    .status(200)
    .json(new ApiResponse(200,allChats,"all chats fetched"))
})

export{newChat,allChatAdmin}