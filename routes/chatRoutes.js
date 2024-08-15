import { Router } from "express";
import { sendMessage,getConversation,getSentMessages,getReceivedMessages,deleteMessage } from "../controllers/chatController.js";
import { isAuthenticated } from "../middleware/Authorized.js";

const router = Router();

router.post('/send', sendMessage);
router.get('/conversation/:user', getConversation);
router.get('/sent', isAuthenticated, getSentMessages);
router.get('/received', isAuthenticated, getReceivedMessages);
router.delete('/message/:id', isAuthenticated, deleteMessage);

export default router;
