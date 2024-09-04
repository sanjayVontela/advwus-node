import { Router } from "express";
import {allMessages, sendMessage} from "../controllers/messageController.js";
const router = Router();

router.get("/:chatId",allMessages);
router.post("/",sendMessage);

export default router;