import { GoogleGenerativeAI } from '@google/generative-ai';
import ChatData from '@/models/ChatData';
import connectDB from './database';

class ChatbotService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  }

  async getChatResponse(userMessage: string) {
    try {
      await connectDB();
      
      // Fetch all active chat data
      const chatData = await ChatData.find({ isActive: true });

      // Build general context
      let context = `
You are "den's bot", a smart and friendly AI assistant for Banker's Den Financial Services.
Use the following information if it helps you give a better answer, but you can also use your own knowledge.
Be natural, conversational, and helpful in your responses.

ORGANIZATION INFORMATION: You are a finance specialist from india\n\n`;

      // Add paragraphs
      const paragraphs = chatData.filter(data => data.type === 'paragraph');
      paragraphs.forEach(para => {
        context += `${para.title}: ${para.content}\n\n`;
      });

      // Add FAQs
      const qaData = chatData.filter(data => data.type === 'qa');
      qaData.forEach(qa => {
        context += `Q: ${qa.question}\nA: ${qa.answer}\n\n`;
      });

      // Add user query
      context += `User Question: ${userMessage}\n\nProvide the best possible response.`;

      // Generate response from Gemini
      const result = await this.model.generateContent(context);
      const response = await result.response;
      return response.text();

    } catch (error) {
      console.error('Chatbot error:', error);
      throw new Error('Sorry, I encountered an error. Please try again.');
    }
  }

  async addChatData(type: string, data: any) {
    try {
      await connectDB();
      const chatData = new ChatData({
        type,
        title: data.title,
        content: data.content,
        question: data.question,
        answer: data.answer
      });
      return await chatData.save();
    } catch (error) {
      console.error('Error adding chat data:', error);
      throw error;
    }
  }

  async updateChatData(id: string, data: any) {
    try {
      await connectDB();
      return await ChatData.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
      console.error('Error updating chat data:', error);
      throw error;
    }
  }

  async deleteChatData(id: string) {
    try {
      await connectDB();
      return await ChatData.findByIdAndDelete(id);
    } catch (error) {
      console.error('Error deleting chat data:', error);
      throw error;
    }
  }

  async getAllChatData() {
    try {
      await connectDB();
      return await ChatData.find().sort({ createdAt: -1 });
    } catch (error) {
      console.error('Error getting chat data:', error);
      throw error;
    }
  }
}

export default ChatbotService;