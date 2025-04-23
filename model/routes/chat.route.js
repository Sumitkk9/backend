import { Router } from "express";
import { subscribe,unSubscribe } from "../controllers/subscribe.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { allChatAdmin, newChat } from "../controllers/chat.controllers.js";
import {upload} from "../middlewares/multer.middleware.js"



const router = Router()

router.route("/message").post( 
    upload.fields([
    {name:"photo",
        maxCount: 1
    },
    {name:"video",
        maxCount: 1},
    {name:"document",
     maxCount: 1}
]),newChat)
router.route("/allChat").get(allChatAdmin)

export default router 