import { Router } from "express";
import { uploadVideo,deleteVideo } from "../controllers/uploadVideo.controller.js";
import { verifyJwt,easyverifyJwt } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { singleVideo, videos, viewsUpdate } from "../controllers/video.controller.js";
import { basicSearch } from "../controllers/search.controllers.js";
basicSearch


const router = Router()

router.route("/video-upload").post(verifyJwt,
    upload.fields([
        {name:"video",
            maxCount: 1
        },
        {name:"thumbnail",
            maxCount: 1}
    ]),
    uploadVideo)
router.route("/delete-video/:video").post(verifyJwt,deleteVideo)
router.route("/allvideos").get(videos)
router.route("/watch/:videoid").get(easyverifyJwt,singleVideo)
router.route("/channel/:username").get(singleVideo)
router.route("/:videoId").get(viewsUpdate)
router.route("/s/:basic").get(basicSearch)

export default router