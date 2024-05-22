import userRoutes from "./user/user.routes.js";
import productRoutes from "./product/product.routes.js";
import express from "express";

const router = express.Router();


// implementing user routes..
router.use("/user",userRoutes);
router.use("/product",productRoutes);

export default router;