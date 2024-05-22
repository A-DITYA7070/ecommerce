import express from "express";

import { 
    deleteProduct, 
    getAdminProducts, 
    getAllCategories, 
    getLatestProducts, 
    getProductDetails, 
    getProducts, 
    newProduct, 
    searchProducts, 
    updateProduct 
} from "../../controllers/product.controller.js";

import { singleUpload } from "../../middlewares/multer.js";
import { adminOnly } from "../../middlewares/auth.middleware.js";


const router = express.Router();


router.route("/new").post(singleUpload,newProduct);
router.route("/").get(getProducts);
router.route("/latest").get(getLatestProducts);
router.route("/categories").get(getAllCategories);
router.route("/admin-products").get(adminOnly,getAdminProducts);

router.route("/search").get(searchProducts);


router.route("/:id")
.get(getProductDetails)
.put(adminOnly,singleUpload,updateProduct)
.delete(adminOnly,deleteProduct);






export default router;