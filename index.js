import { app } from "../app.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./env" });

let isConnected = false;

const connectDb = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  isConnected = true;
};

export default async function handler(req, res) {
  await connectDb();          // connect MongoDB
  app(req, res);              // pass the request to Express app
}
