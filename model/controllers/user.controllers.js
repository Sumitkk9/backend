import {asyncHandler} from "../utils/asyncHandler.js"
import {ApiError} from  "../utils/ApiError.js"
import {ApiResponse} from  "../utils/ApiResponse.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import  jwt  from "jsonwebtoken"
import { channel } from "diagnostics_channel"
const generateAccessandRefreshToken = async(userId)=>{

  try {
    const user = await User.findById(userId) //did db request
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken() 
    user.refreshToken =  refreshToken
    await user.save({validateBeforeSave: false})

    return {accessToken,refreshToken}

  } catch (error) {
    throw new ApiError(500,"Something went wrong while generating access and refresh token")
  }



}
const registerUser = asyncHandler( async  (req,res) =>{

    // get data from form 
    //then check all the fields are there 
    //check if user already exists: check with username/email
    //check for imgs, check for avatar
    //upload them to cloudinary, avatar
    // create user object -
    //then send data to db 
    //remove password and refresh token field from response 
    //check for user creation

  const {fullName,email,username,password} = req.body

  if(
    [fullName,email,username,password].some((filed)=>filed?.trim()==="")
  ){
    throw new ApiError(400,"all field are required")
  }

  const existedUser = await User.findOne({
    $or: [{email},{username}]
  })

  if(existedUser){
    throw new ApiError(409,"User Already Exists")
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const  coverImageLocalPath = req.files?.coverImage[0]?.path;

  if(!avatarLocalPath){
    throw new ApiError(400,"Avatar file is required")
  }
 
 const avatar = await uploadOnCloudinary(avatarLocalPath)

 const coverImage = await uploadOnCloudinary(coverImageLocalPath) 

  if(!avatar){
    throw new ApiError(400,"Avatar file is required")
  }

 const user =  await  User.create({
    fullName,
    email,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    password,
    username: username.toLowerCase()

  })

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiError(500,"not able to register")
  }

//   if(fullName ===""){
//     throw new ApiError(400,"fullname is required")
//   }
 


   return   res.status(201).json(
    new ApiResponse(200,createdUser, "user Registered Successfully")
   )
} )




const loginUser = asyncHandler(async (req,res)=>{
  //get form data 
  //check if form data is empty or not
  // check password

  const {username, password} = req.body

  if(!username) throw new ApiError(400,"Username is required") 
  if(!password) throw new ApiError(400,"Password is required") 

    const user = await User.findOne({
      $or: [{username}]
    })

    if(!user)  throw new ApiError(404,"User Not found") 

    const checkPassword = await user.isPasswordCorrect(password);
     if(!checkPassword) throw new ApiError(401, "Wrong Password")
      const {accessToken, refreshToken } = await generateAccessandRefreshToken(user._id)
     const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

      const options={
        httpOnly:true,
        secure:true
      }
      return res 
      .status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken", refreshToken,options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,accessToken,refreshToken
          },
          "User logged In Successfully"
        )
      )
    })

    const logoutUser = asyncHandler (async(req,res)=>{

    const user =  await User.findByIdAndUpdate(
        req.user._id,
        {
          $unset:{
            refreshToken:1
          }
        },
        {
          new:true
        }
      )

      const options = {
        httpOnly:true,
        secure:true
      }

      return res 
      .status(200)
      .clearCookie("accessToken",options)
      .clearCookie("refreshToken",options)
      .json(
        new ApiResponse(
          200,
          user.refreshToken,
          "User logged Out Successfully"
        )
      )

    })

    const refreshAccessToken = asyncHandler(async(req,res)=>{
    const incomingToken =   req.cookies.refreshToken || req.body.refreshToken

    if(!incomingToken) throw new ApiError(401, "unauthorized access")
    
  try {
     const decodedToken = jwt.verify(incomingToken,process.env.REFRESH_TOKEN_SECRET)
      
      const user = await User.findById(decodedToken?._id)
  
      if(!user) throw new ApiError(401,"Invalid refresh token")
      
      if(incomingToken !== user?.refreshToken) throw new ApiError (401, "Refresh Token Expired or Used")
      
      const {newRefreshToken,accessToken} = await generateAccessandRefreshToken(user._id)
      const options = {
        httpOnly: true,
        secure: true
      }
  
      return res 
      .status(200)
      .cookie("accessToken", accessToken, options )
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(200,{
          accessToken, refreshToken:newRefreshToken
        },
      "Access token refreshed"
      )
      )
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token")
  }
  
  })

  const updateUser = asyncHandler(async(req,res)=>{
    // only loggedin user can edit 
    // we have cookies to get user info 
    // check if token is valid or not 

  const {fullName,email} = await req.body

    if(!fullName) throw new ApiError(400,"Full name required")
    if(!email) throw new ApiError(400,"Email required")

    const user =   await User.findByIdAndUpdate(
         req.user?._id,
         { 
        $set: { 
          fullName:fullName,
          email: email
        } 
      },
      {
        new:true
      }
    
    ).select("-password")
     
    return res
    .status(200)
    .json(new ApiResponse(
      200,
     { user: user},
      "updated"
    ) )


  })

  const passwordUpdate = asyncHandler(async (req,res)=>{
    
    const {oldPassword,newPassword} = req.body

    if( !(oldPassword && newPassword)){
      throw new ApiError(400,"all field are required")
    }

   const userInfo =   await User.findById(req.user._id)

   const checkOldPassword = await userInfo.isPasswordCorrect(oldPassword)

   if(!checkOldPassword) throw new ApiError(400,"Incorrect old password")

   userInfo.password = newPassword

   await userInfo.save({validateBeforeSave:false})
   return res
    .status(200)
    .json(new ApiResponse(200,{},"Password Updated"))

  })

  const registerUserResponse = asyncHandler( async(req,res) =>{    
    return   res
    .status(201)
    .json(
      new ApiResponse(200,req.user, "users list")
     )
  })

const fileUpdate = asyncHandler(async(req,res)=>{

  if( !(req.files?.coverImage || req.files?.avatar)) throw new ApiError(404,"Nothing to update")
  let avatar;
  let coverImg;
  if(req.files?.avatar){
    const avatarLocalPath = req.files?.avatar[0]?.path;
    avatar = await uploadOnCloudinary(avatarLocalPath)
  }

  if( req.files?.coverImage != undefined){
    const  coverImageLocalPath = req.files?.coverImage[0]?.path;
     coverImg = await uploadOnCloudinary(coverImageLocalPath)
  }
  

 const newuser= await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set:{
        avatar: avatar?.url ||  req.user?.avatar,
        coverImage: coverImg?.url ||  req.user?.coverImage,
      }
    },
    {
      new:true
    }
  )


  return res
  .status(200)
  .json(new ApiResponse(200,
    {newuser},
    "cover or avatar img updated"
  )

  )
})

const getUserChannelProfile = asyncHandler(async (req,res)=>{

  const {username} = req.params
  if(!username?.trim()) throw new ApiError(400,"username is missing")

  const channel =   await User.aggregate([
      {
        $match:{
          username: username?.toLowerCase()
        }
      },
      {
        $lookup:{
          from:"videos",
          localField:"_id",
          foreignField:"owner",
          as:"allvideos"

        }
      },
      {
        $lookup:{
          from: "subscriptions",
          localField:"_id",
          foreignField:"channel",
          as:"subscribers"
        }
      },
      {
        $lookup:{
          from: "subscriptions",
          localField:"_id",
          foreignField:"subscribedBy",
          as:"subscribedTo"
        }
      },
      {
        $addFields:{
          subscribersCount:{
            $size:"$subscribers",
          },
          channelSubscribedTo :{
            $size:"$subscribedTo"
          },
          isSubscribed:{
            $cond:{
              if:{$in: [req.user?._id,"$subscribers.subscribedBy"]},
              then:true,
              else:false
            }
          }
        }
      },
      {
        $project:{
          fullName:1,
          coverImage:1,
          avatar:1,
          subscribersCount:1,
          channelSubscribedTo:1,
          isSubscribed:1,
          email:1,
          username:1,
          createdAt:1,
          allvideos:1
        }
      }
    ])

    return res
    .status(200)
    .json(new ApiResponse(200,
      channel[0],
      "user Channel fetched successfully"
    ))
})

export {updateUser,
  getUserChannelProfile,
  registerUser,
  registerUserResponse,
  loginUser,
  logoutUser,
  refreshAccessToken,
  passwordUpdate,
  fileUpdate}