import express from "express";
import dotenv from "dotenv";
import Routes from "./routes/index.js"
import { errorMiddleWare } from "./middlewares/error.js";
import { connectToMongoDB } from "./db/databases/mongo-db-connect.js";
import NodeCache from "node-cache";

const app = express();
dotenv.config({path:".env"});

app.use(express.json());

// connecting to database..
connectToMongoDB();

// implementing caching using NodeCache.
export const myCache = new NodeCache();


// using app routes.
app.use("/api/v1",Routes);

app.use("/uploads",express.static("uploads"));
app.use(errorMiddleWare);

app.listen(process.env.PORT,()=>{
    console.log(`server is running on ${process.env.PORT}`)
})