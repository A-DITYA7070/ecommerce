import express from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import { errorMiddleWare } from "./middlewares/error.js";
import { connectToMongoDB } from "./db/databases/mongo-db-connect.js";

const app = express();
dotenv.config({path:".env"});

app.use(express.json());

// connecting to database..
connectToMongoDB();


// using app routes.
app.use("/api/v1/user",userRoutes);





app.use(errorMiddleWare);

app.listen(process.env.PORT,()=>{
    console.log(`server is running on ${process.env.PORT}`)
})