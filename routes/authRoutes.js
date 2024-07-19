import { Router } from "express";

import { login, register, changePassword, profile, changeProfile } from '../controllers/authController.js'


const router = Router();

router.post("/login",login);
router.post("/register",register);
router.post("/changepassword",changePassword);
router.get("/profile",profile);
router.post("/changeprofile",changeProfile);

export default router;