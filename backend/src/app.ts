import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.js";
import { connectDB } from "./utils/features.js";
import { errorMiddleWare } from "./middlewares/error.js";

const app = express();
dotenv.config({path:".env"});

app.use(express.json());

// connecting to database..
connectDB();




app.use("/api/v1/user",userRoutes);





app.use(errorMiddleWare);

app.listen(process.env.PORT,()=>{
    console.log(`server is running on ${process.env.PORT}`)
})