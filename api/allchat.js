import { Chat } from "../model/models/chat.modal"
import { ApiResponse } from "../model/utils/ApiResponse"

 const allChatAdmin = asyncHandler(async(req,res)=>{

    const allChats = await Chat.find()
    
    return res
    .status(200)
    .json(new ApiResponse(200,allChats,"all chats fetched"))
})


export default function handler(req, res) {
    return allChatAdmin(req, res); // Wrapped async function
  }

