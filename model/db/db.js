import mongoose from "mongoose";
// require('dotenv').config('./.env') 
import { DB_NAME } from "../../constants.js";


const connectDb = async  ()=>{
  try {
     const connectionInstance = await mongoose.connect( `${process.env.DB_Url}/${DB_NAME}`)
      console.log(`connected to Mongodb ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log(`Failed to connect ${error}`)
        throw error 
    }
   
}

export default connectDb