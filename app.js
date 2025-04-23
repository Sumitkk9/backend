import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

// using this cors to allow frontend to access our api only specific orgins 
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true, limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

// routesimport

// app.get('/route', (req, res) => {
//     res.send('Hello, this is a GET request!');
// });
import userRoute from './model/routes/user.routes.js'
import subscribeRoute from './model/routes/subscribe.route.js'
import uploadvideoRoute from  './model/routes/video.route.js'
import chatRoute from  './model/routes/chat.route.js'
app.use("/api/v1/users",userRoute)
app.use("/api/v1/channel",subscribeRoute)
app.use("/api/v1/video",uploadvideoRoute)
app.use("/api/v1/chat",chatRoute)

export {app}