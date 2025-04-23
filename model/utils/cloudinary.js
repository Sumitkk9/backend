import { v2 as cloudinary } from "cloudinary";
import { publicDecrypt } from "crypto";
import fs from 'fs'

 // Configuration
 cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async(filePath)=>{
    try {
        if(!filePath) return null 

        //upload the file on cloudinary
       const response = await cloudinary.uploader.upload(filePath,{
            resource_type:"auto"
        })
        //file has been uploaded file successfully 
        console.log("file is uploaded successfully", response.url)
        fs.unlinkSync(filePath)
        return response 
    } catch (error) {
        fs.unlinkSync(filePath) //remove the locally saved temporary file
        return null;
    }
}


const deleteFromCloudinary = async (publicId)=>{
   try {
    console.log(`"${publicId}"`)
    if(!publicId) return null
    const res = await cloudinary.uploader.destroy(`${publicId}`,{ resource_type: "auto" })
    console.log("hi",res)

    return res
   } catch (error) {
    return null
    
   }
}

export {uploadOnCloudinary,deleteFromCloudinary}