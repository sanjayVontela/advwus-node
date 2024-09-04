import { Router } from "express";
import { sendMessage,getConversation,getSentMessages,getReceivedMessages,deleteMessage, getAllConversations, markAsRead, getSenderName } from "../controllers/chatController.js";
import { isAuthenticated } from "../middleware/Authorized.js";

const router = Router();

router.post('/send', sendMessage);
router.get("/all",getAllConversations)
router.get('/conversation/:user', getConversation);
router.get('/sent', isAuthenticated, getSentMessages);
router.get('/received', isAuthenticated, getReceivedMessages);
router.delete('/message/:id', isAuthenticated, deleteMessage);
router.post('/markAsRead',isAuthenticated,markAsRead);
router.get("/getSender/:id",isAuthenticated,getSenderName);
export default router;
