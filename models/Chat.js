import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
    message: { type: String, trim: true },
    readBy: { type: Boolean,default:false },
},
{timestamps:true}
);

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

export default ChatMessage;
