import { Router } from "express";
import {uploadImage} from './imageConfig.js'
import { upload } from "./imageConfig.js";
const router = Router();

router.post("/imageUpload",upload.single('image'),uploadImage)

export default router;