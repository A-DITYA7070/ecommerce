import express from "express";
import {
    allCoupons,
    applyDiscount,
    deleteCoupon,
    getCoupon,
    newCoupon,
    updateCoupon
} from "../../controllers/payment.controller.js"
import { adminOnly } from "../../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/coupon/new").post(adminOnly,newCoupon);
router.route("/coupon/discount").get(applyDiscount);
router.route("/coupon/all").get(adminOnly,allCoupons);
router.route("/coupon/:id")
.get(adminOnly,getCoupon)
.put(adminOnly,updateCoupon)
.delete(adminOnly,deleteCoupon);


export default router;