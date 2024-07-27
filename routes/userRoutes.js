import { Router } from "express";
import { allCustomers,addProduct, ownProducts,deleteProduct,getProduct,editProduct, addToWishlist,allWishlist, deleteWishlist } from "../controllers/userController.js";
import { allProducts } from "../controllers/userController.js";
import { isAuthenticated } from "../middleware/Authorized.js";
const router = Router()

router.get("/allcustomers",isAuthenticated,allCustomers);
router.post("/addProduct",isAuthenticated,addProduct);
router.get("/ownProducts",isAuthenticated,ownProducts);
router.delete("/deleteItem/:id",isAuthenticated,deleteProduct)
router.get("/getProduct/:id",isAuthenticated,getProduct);
router.post("/editProduct",isAuthenticated,editProduct);
router.get("/addWish/:id",isAuthenticated,addToWishlist);
router.get('/allWishlist',isAuthenticated,allWishlist);
router.delete("/deleteWishlist/:id",isAuthenticated,deleteWishlist);
router.get("/allproducts",isAuthenticated,allProducts);

export default router;