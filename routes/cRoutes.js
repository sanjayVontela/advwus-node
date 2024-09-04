import { Router } from "express";
import  {accessChat,fetchChats} from "../controllers/chatController1.js";
const router = Router();

router.post("/", accessChat);
router.get("/", fetchChats);

export default router;