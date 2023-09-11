import { messagesModel } from "../models/message.js";

class ChatManager {
    async getMessages() {
        //return await messageModel.find().lean();
        return await messagesModel.find()
    }

    async createMessage(message) {
        return await messagesModel.create(message);
    }
}

export default ChatManager; 