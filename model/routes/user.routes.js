import { Router } from "express";
import {updateUser,
    registerUser,
    registerUserResponse,
    loginUser,
    logoutUser,
    refreshAccessToken,
    passwordUpdate,
    fileUpdate,
    getUserChannelProfile} from "../controllers/user.controllers.js"
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {name:"avatar",
            maxCount: 1
        },
        {name:"coverImage",
            maxCount: 1}
    ]),
    registerUser
)

router.route("/user").get(verifyJwt,registerUserResponse)
router.route("/login").post(loginUser)
router.route("/logout").post(verifyJwt,logoutUser)
router.route("/access-token").post(refreshAccessToken) 
router.route("/update-user").post(verifyJwt,updateUser) 
router.route("/change-password").post(verifyJwt,passwordUpdate) 
router.route("/channel/:username").post(verifyJwt,getUserChannelProfile) 

router.route("/file-update").post( verifyJwt,  upload.fields([
    {name:"avatar",
        maxCount: 1
    },
    {name:"coverImage",
        maxCount: 1}
]),fileUpdate) 
export default router