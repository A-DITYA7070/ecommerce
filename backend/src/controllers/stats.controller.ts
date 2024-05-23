import { NextFunction,Request,Response } from "express"
import { catchAsyncError } from "../middlewares/error.js"
import { myCache } from "../app.js";
import { Product } from "../db/models/product.model.js";
import { User } from "../db/models/user.model.js";
import { Order } from "../db/models/order.model.js";
import { calcuatePercentage } from "../utils/features.js";
import { sanitizeFilter } from "mongoose";


/**
 * Controller function to get admin dashboard stats.
 */
const getDashboardStats = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {

    let stats = {};

    if(myCache.has("admin-stats")){
        stats = JSON.parse(myCache.get("admin-stats") as string);
    }else{

        const today = new Date();
        const sixMonthAgo = new Date();
        sixMonthAgo.setMonth(sixMonthAgo.getMonth() - 6);

        const thisMonth = {
            start : new Date(
                today.getFullYear(),
                today.getMonth(),
                1
            ),
            end : today
        };

        const lastMonth = {
            start : new Date(
                today.getFullYear(),
                today.getMonth()-1,
                1
            ),
            end : new Date(
                today.getFullYear(),
                today.getMonth(),
                0
            )
        }; 

        const thisMonthProductsPromise = Product.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end
            }
        });

        const lastMonthProductsPromise = Product.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end
            }
        });

        const thisMonthUsersPromise = User.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end
            }
        });

        const lastMonthUsersPromise = User.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end
            }
        });

        const thisMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: thisMonth.start,
                $lte: thisMonth.end
            }
        });

        const lastMonthOrdersPromise = Order.find({
            createdAt: {
                $gte: lastMonth.start,
                $lte: lastMonth.end
            }
        });

        const lastSixMonthOrdersPromise = Order.find({
            createdAt: {
                $gte:sixMonthAgo,
                $lte:today
            }
        });

        const latestTransactionsPromise = Order
        .find({})
        .select([
            "orderItems",
            "discount",
            "total",
            "status"
        ])
        .limit(4);

        const [
            thisMonthProducts,
            thisMonthUsers,
            thisMonthOrders,
            lastMonthProducts,
            lastMonthUsers,
            lastMonthOrders,
            productsCount,
            usersCount,
            ordersCount,
            lastSixMonthOrders,
            categories,
            femaleCount,
            latestTransaction
        ] = await Promise.all([
            thisMonthProductsPromise,
            thisMonthUsersPromise,
            thisMonthOrdersPromise,
            lastMonthProductsPromise,
            lastMonthUsersPromise,
            lastMonthOrdersPromise,
            Product.countDocuments(),
            User.countDocuments(),
            Order.find({}).select("total"),
            lastSixMonthOrdersPromise,
            Product.distinct("category"),
            User.countDocuments({gender:"female"}),
            latestTransactionsPromise
        ]);


        const productChangePercentage = calcuatePercentage(
            thisMonthProducts.length,
            lastMonthProducts.length
        );

        const userChangePercentage = calcuatePercentage(
            thisMonthUsers.length,
            lastMonthUsers.length
        );

        const orderChangePercentage = calcuatePercentage(
            thisMonthOrders.length,
            lastMonthOrders.length
        );
        
        const thisMonthRevenue = thisMonthOrders.reduce(
            (total,order) =>  total + (Number(order.total) || 0 ),
            0
        );
     
        const lastMonthRevenue = lastMonthOrders.reduce(
            (total,order) => total + (Number(order.total) || 0),
            0
        );

        const revenue = ordersCount.reduce(
            (total,order) => total + (Number(order.total) || 0),
            0
        );

        const count = {
            revenue,
            user: usersCount,
            product: productsCount,
            order: ordersCount.length,
        }

        const data = {
            product:productChangePercentage,
            user:userChangePercentage,
            order:orderChangePercentage
        };

        const orderMonthCounts = new Array(6).fill(0);
        const orderMonthlyRevenue = new Array(6).fill(0);

        lastSixMonthOrders.forEach((order)=>{
            const creationDate = order.createdAt;
            const monthDiff = today.getMonth() - creationDate.getMonth();
            if(monthDiff < 6){
                orderMonthCounts[6 - monthDiff - 1] += 1;
                orderMonthlyRevenue[6 - monthDiff - 1] += Number(order.total);
            }
        });

        const categoriesCountPromise = categories.map(category => Product.countDocuments({category}));
        
        const categoriesCount = await Promise.all(categoriesCountPromise);
        
        const categryCount:Record<string,number> [] = [];

        categories.forEach((category,i) => {
            categryCount.push({
                [category]:Math.round((categoriesCount[i]/productsCount) * 100)
            });
        });

        const userRatio = {
            male:usersCount - femaleCount,
            female : femaleCount
        }

        const modifiedTransaction = latestTransaction.map(i => ({
            _id:i._id,
            discount:i.discount,
            amount:i.total,
            quantity:i.orderItems.length,
            status:i.status
        }));

        stats = {
            categryCount,
            changePercentage : data,
            count,
            chart:{
                order:orderMonthCounts,
                revenue:orderMonthlyRevenue
            },
            userRatio,
            latestTransactions:modifiedTransaction
        }

        myCache.set("admin-stats",JSON.stringify(stats));

    }

    res.status(200)
    .json({
        success:true,
        stats
    });
});

/**
 * Controller function to get pie chart
 */
const getPiechart = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {

});


/**
 * Controller function to get barchart in admin dashboard.
 */
const getBarChart = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {

});

/**
 * controller function to get line chart in admin dashboard
 */
const getLineChart = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {

});















export {
    getDashboardStats,
    getPiechart,
    getLineChart,
    getBarChart,
}