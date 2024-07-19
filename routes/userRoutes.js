import { Router } from "express";
import { allCustomers } from "../controllers/userController.js";

const router = Router()

router.get("/allcustomers",allCustomers);

export default router;