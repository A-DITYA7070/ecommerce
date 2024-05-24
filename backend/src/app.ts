import express from "express";
import dotenv from "dotenv";
import Routes from "./routes/index.js"
import { errorMiddleWare } from "./middlewares/error.js";
import { connectToMongoDB } from "./db/databases/mongo-db-connect.js";
import NodeCache from "node-cache";
import morgan from "morgan";
import Stripe from "stripe";

const app = express();

// implementing dotenv 
dotenv.config({path:".env"});

app.use(express.json());
app.use(morgan("dev"));

// connecting to database..
connectToMongoDB();

const stripeKey = process.env.STRIPE_KEY || "";

export const stripe = new Stripe(stripeKey);
// implementing caching using NodeCache.
export const myCache = new NodeCache();


// using app routes.
app.use("/api/v1",Routes);

app.use("/uploads",express.static("uploads"));
app.use(errorMiddleWare);

app.listen(process.env.PORT,()=>{
    console.log(`server is running on ${process.env.PORT}`)
})