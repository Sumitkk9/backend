import connectDb from "./model/db/db.js"
import express from "express"
import jsonData from "./json.js"
import dotenv from'dotenv'
import {app} from './app.js'
const port = 3000

dotenv.config({path:'./env'}) 

app.get('/', (req, res) => {
  res.send('Hello World');
});

connectDb()
.then(()=>{
  app.listen(process.env.PORT || 8000, ()=>{
    console.log(`server is running at port: ${process.env.Port}`)
  }  )
})
.catch((err)=>{
  console.log("Mongo db Connection Failed !!!", err)
}) 

export default app;