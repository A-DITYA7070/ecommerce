import { NextFunction,Request,Response } from "express"
import { catchAsyncError } from "../middlewares/error.js"
import { myCache } from "../app.js";
import { Product } from "../db/models/product.model.js";
import { User } from "../db/models/user.model.js";
import { Order } from "../db/models/order.model.js";
import { calcuatePercentage, getCategories, getChartData, MyDocument } from "../utils/features.js";


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
            const monthDiff = ((today.getMonth() - creationDate.getMonth()) + 12) % 12;
            if(monthDiff < 6){
                orderMonthCounts[6 - monthDiff - 1] += 1;
                orderMonthlyRevenue[6 - monthDiff - 1] += Number(order.total);
            }
        });

        const categryCount:Record<string,number> [] = await getCategories({
            categories,
            productsCount
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
 * Controller function to get barchart in admin dashboard.
 */
const getPiechart = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {

    let charts;
   
    if(myCache.has("admin-pie-charts")){
        charts = JSON.parse(myCache.get("admin-pie-charts") as string);
    }else{
        const [
            processingOrder,
            shippedOrder,
            deliveredOrder,
            categories,
            productsCount,
            productsOutOFStock,
            allOrders,
            allUsers,
            adminUsers,
            customerUsers
        ] = await Promise.all([
            Order.countDocuments({status:"PROCESSING"}),
            Order.countDocuments({status:"SHIPPED"}),
            Order.countDocuments({status:"DELIVERED"}),
            Product.distinct("category"),
            Product.countDocuments(),
            Product.countDocuments({stock:0}),
            Order.find({}).select(["total","discount","subtotal","tax","shippingCharges"]),
            User.find({}).select(["dob"]),
            User.countDocuments({role:"admin"}),
            User.countDocuments({role:"user"})
        ]);

        const orderFullfillment = {
            processing:processingOrder,
            shipped:shippedOrder,
            delivered:deliveredOrder,
        }

        const productCategories = await getCategories({
            categories,
            productsCount
        });

        const stockAvailability = {
            inStock:productsCount - productsOutOFStock,
            outOFStock:productsOutOFStock
        }

        const totalGrossIncome = allOrders.reduce(
            (prev,order) => prev + Number(order.total || 0),
            0
        );

        const totalDiscount = allOrders.reduce(
            (prev,order) => prev + Number(order.discount || 0),
            0
        );

        const productionCost = allOrders.reduce(
            (prev,order) => prev + Number(order.shippingCharges || 0),
            0
        );

        const burnt = allOrders.reduce(
            (prev,order) => prev + Number(order.tax || 0),
            0
        );

        const marketingCost = Math.round(totalGrossIncome * (30 / 100));

        const netMargin = totalGrossIncome - (totalDiscount+productionCost+burnt+marketingCost);

        const revenueDistribution = {
            netMargin,
            discount:totalDiscount,
            productionCost,
            burnt,
            marketingCost
        };

        const usersAgeGroup = {
            teen: allUsers.filter(i=>i.age<20).length,
            adult: allUsers.filter(i=> i.age>=20 && i.age<40).length,
            old: allUsers.filter(i=> i.age>40).length
        }

        const adminCustomer = {
            admin:adminUsers,
            customer:customerUsers
        }

        charts = {
            orderFullfillment,
            productCategories,
            stockAvailability,
            revenueDistribution,
            usersAgeGroup,
            adminCustomer
        }

        myCache.set("admin-pie-charts",JSON.stringify(charts))
    }

    res.status(200)
    .json({
        success:true,
        charts
    });
});

/**
 * Controller function to get pie chart
 */
const getBarchart = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {

    let charts;

    const key = "admin-bar-charts";

    if(myCache.has(key)){
        charts = JSON.parse(myCache.get(key) as string);
    }else{

        const today = new Date();
        const sixMonthAgo = new Date();
        sixMonthAgo.setMonth(today.getMonth() - 6);

        const tweleveMonthAgo = new Date();
        tweleveMonthAgo.setMonth(today.getMonth() - 12);

        const lastTwelveMonthsOrdersPromise = Order.find({
            createdAt:{
                $gte: tweleveMonthAgo,
                $lte: today
            }
        }).select(["createdAt","discount"]);

        const lastSixMonthsUsersPromise = User.find({
            createdAt:{
                $gte: tweleveMonthAgo,
                $lte: today
            }
        }).select("createdAt");

        const lastSixMonthProductsPromise = Product.find({
            createdAt:{
                $gte: sixMonthAgo,
                $lte: today
            }
        }).select(["createdAt","discount"]);

        const [
            products,
            users,
            orders
        ] = await Promise.all([
            lastSixMonthProductsPromise,
            lastSixMonthsUsersPromise,
            lastTwelveMonthsOrdersPromise,
        ]);

        const productCounts = getChartData({
            length:6,
            today,
            docArr:products
        });

        const usersCounts = getChartData({
            length: 6,
            today,
            docArr:users
        });

        const ordersCounts = getChartData({
            length: 6,
            today,
            docArr:orders
        });


        charts = {
            users: usersCounts,
            products: productCounts,
            orders: ordersCounts
        }
        
        myCache.set(key,JSON.stringify(charts));
    }

    res.status(200)
    .json({
        success:true,
        charts
    });
});

/**
 * controller function to get line chart in admin dashboard
 */
const getLineChart = catchAsyncError(async(
    req:Request,
    res:Response,
    next:NextFunction
) => {

    let charts;

    const key = "admin-line-charts";

    if(myCache.has(key)){
        charts = JSON.parse(myCache.get(key) as string);
    }else{

        const today = new Date();
        
        const tweleveMonthAgo = new Date();
        tweleveMonthAgo.setMonth(today.getMonth() - 12);

        const lastTwelveMonthsProductsPromise = Product.find({
            createdAt:{
                $gte: tweleveMonthAgo,
                $lte: today
            }
        }).select(["createdAt","discount"]);

        const lastTwelveMonthsUsersPromise = User.find({
            createdAt:{
                $gte: tweleveMonthAgo,
                $lte: today
            }
        }).select("createdAt");

        const lastTwelveMonthsOrdersPromise = Order.find({
            createdAt:{
                $gte: tweleveMonthAgo,
                $lte: today
            }
        }).select(["createdAt","discount","total"]);

        const [
            products,
            users,
            orders
        ] = await Promise.all([
            lastTwelveMonthsProductsPromise,
            lastTwelveMonthsUsersPromise,
            lastTwelveMonthsOrdersPromise,
        ]);

        const productCounts = getChartData({
            length:12,
            today,
            docArr:products
        });

        const usersCounts = getChartData({
            length: 12,
            today,
            docArr:users
        });

        const discount = getChartData({
            length: 12,
            today,
            docArr: orders,
            property:"discount"
        });

        const revenue = getChartData({
            length:12,
            today,
            docArr:orders,
            property:"total"
        })

        charts = {
            users: usersCounts,
            products: productCounts,
            discount: discount,
            revenue: revenue
        }
        
        myCache.set(key,JSON.stringify(charts));
    }

    res.status(200)
    .json({
        success:true,
        charts
    });
});




export {
    getDashboardStats,
    getPiechart,
    getLineChart,
    getBarchart
}