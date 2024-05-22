import express from "express";

import { 
    allOrders,
    getSingleOrderDetails,
    myOrderDetails,
    newOrder
} from "../../controllers/order.controller.js";
import { adminOnly } from "../../middlewares/auth.middleware.js";

const router = express.Router();


router.route("/new").post(newOrder);
router.route("/all").get(adminOnly,allOrders);


router.route("/:id").get(getSingleOrderDetails);
router.route("/my/:id").get(myOrderDetails);











export default router;