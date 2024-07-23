import { Router } from "express";
import { allCustomers,addProduct, ownProducts,deleteProduct,getProduct,editProduct, addToWishlist,allWishlist, deleteWishlist } from "../controllers/userController.js";

const router = Router()

router.get("/allcustomers",allCustomers);
router.post("/addProduct",addProduct);
router.get("/ownProducts",ownProducts);
router.delete("/deleteItem/:id",deleteProduct)
router.get("/getProduct/:id",getProduct);
router.post("/editProduct",editProduct);
router.get("/addWish/:id",addToWishlist);
router.get('/allWishlist',allWishlist);
router.delete("/deleteWishlist/:id",deleteWishlist);

export default router;