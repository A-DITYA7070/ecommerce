import express from "express";
import { newUser } from "../controllers/user.js";


const app = express.Router();

app.route("/new").post(newUser);


export default app;