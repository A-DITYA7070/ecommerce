import userRoutes from "./user/user.routes.js";
import productRoutes from "./product/product.routes.js";
import orderRoutes from "./order/order.routes.js";
import paymentRoutes from "./payment/payment.routes.js";
import statsRoutes from "./stats/stats.routes.js";

import express from "express";

const router = express.Router();


// implementing user routes..
router.use("/user",userRoutes);
router.use("/product",productRoutes);
router.use("/order",orderRoutes);
router.use("/payment",paymentRoutes);
router.use("/",statsRoutes);





export default router;