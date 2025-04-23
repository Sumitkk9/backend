import { Router } from "express";
import { subscribe,unSubscribe } from "../controllers/subscribe.controllers.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";



const router = Router()

router.route("/subscribe/:channelname").get(verifyJwt,subscribe)
router.route("/unsubscribe/:channelname").get(verifyJwt,unSubscribe)

export default router 