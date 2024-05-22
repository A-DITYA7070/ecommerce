import express from "express";
import { deleteUser, getAllUsers, getUser, newUser, updateUser } from "../../controllers/user.controller.js";
import { adminOnly } from "../../middlewares/auth.middleware.js";


const app = express.Router();

app.route("/new").post(newUser);
app.route("/all").get(adminOnly,getAllUsers);
app.route("/:id")
.get(getUser)
.delete(adminOnly,deleteUser)
.patch(updateUser);



export default app;