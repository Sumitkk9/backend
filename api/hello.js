import { Chat } from "../model/models/chat.modal";

export default async function handler(req, res) {

  const data = Chat.find()
    res.status(200).json({ message: 'Hello World',data });
  }