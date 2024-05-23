import express from "express";
import { adminOnly } from "../../middlewares/auth.middleware.js";
import { getDashboardStats, getPiechart } from "../../controllers/stats.controller.js";


const router = express.Router();


// routes for stats
router.route("/stats").get(adminOnly,getDashboardStats);

// routes for pie-chart
router.route("/pie").get(getPiechart);

// routes for bar-chart

// routes for line chart




export default router;