import express from "express";
import { adminOnly } from "../../middlewares/auth.middleware.js";
import { getBarchart, getDashboardStats, getLineChart, getPiechart } from "../../controllers/stats.controller.js";


const router = express.Router();


// routes for stats
router.route("/stats").get(adminOnly,getDashboardStats);

// routes for pie-chart
router.route("/pie").get(adminOnly,getPiechart);

// routes for bar-chart

router.route("/bar").get(adminOnly,getBarchart);


// routes for line chart

router.route("/line").get(adminOnly,getLineChart);



export default router;