import connectDb from "./model/db/db.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({ path: "./env" });

let isConnected = false;

// Local server (runs only if not in Vercel)
if (process.env.VERCEL !== "1") {
  const port = process.env.PORT || 8000;
  connectDb()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server running locally at http://localhost:${port}`);
      });
    })
    .catch((err) => {
      console.error("MongoDB Connection Failed!!!", err);
    });
}

// Vercel Serverless Handler
export default async function handler(req, res) {
  if (!isConnected) {
    await connectDb();
    isConnected = true;
  }
  return app(req, res);
}
