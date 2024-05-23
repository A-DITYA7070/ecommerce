import express from "express";

import { 
    allOrders,
    deleteOrder,
    getSingleOrderDetails,
    myOrderDetails,
    newOrder,
    processOrder
} from "../../controllers/order.controller.js";
import { adminOnly } from "../../middlewares/auth.middleware.js";

const router = express.Router();


router.route("/new").post(newOrder);
router.route("/all").get(adminOnly,allOrders);


router.route("/:id")
.get(getSingleOrderDetails)
.put(adminOnly,processOrder)
.delete(adminOnly,deleteOrder);

router.route("/my/:id").get(myOrderDetails);











export default router;