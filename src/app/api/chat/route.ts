import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT } from '@/lib/chatbotPrompt';
import connectDB from '@/lib/database';
import ChatSession from '@/models/ChatSession';
import Lead from '@/models/Lead';
import { extractLeadData, shouldGenerateLead } from '@/lib/leadExtractor';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: 'Gemini API Key not configured' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const { messages, sessionId } = await req.json();

    // ── 1. Get AI response ────────────────────────────────────────────────────
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    let rawHistory = messages.slice(0, -1);
    const firstUserIndex = rawHistory.findIndex((msg: any) => msg.role === 'user');
    if (firstUserIndex !== -1) {
      rawHistory = rawHistory.slice(firstUserIndex);
    } else {
      rawHistory = [];
    }

    let sanitizedHistory: any[] = [];
    for (const msg of rawHistory) {
      if (!msg.text) continue;
      if (sanitizedHistory.length === 0) {
        if (msg.role === 'user') {
          sanitizedHistory.push({ role: 'user', parts: [{ text: msg.text }] });
        }
      } else {
        const last = sanitizedHistory[sanitizedHistory.length - 1];
        const role = msg.role === 'user' ? 'user' : 'model';
        if (last.role === role) {
          last.parts[0].text += '\n\n' + msg.text;
        } else {
          sanitizedHistory.push({ role, parts: [{ text: msg.text }] });
        }
      }
    }

    // Gemini requires the last history message to be 'model' before a new 'user' message via sendMessage
    if (sanitizedHistory.length > 0 && sanitizedHistory[sanitizedHistory.length - 1].role === 'user') {
      sanitizedHistory.push({ role: 'model', parts: [{ text: 'Please continue.' }] });
    }

    const latestMessage = messages[messages.length - 1]?.text || '';
    
    let text = '';
    try {
      const chat = model.startChat({ history: sanitizedHistory });
      const result = await chat.sendMessage([{ text: latestMessage }]);
      text = result.response.text();
    } catch (apiError: any) {
      if (apiError.status === 503 || apiError.message?.includes('503')) {
        console.warn('Gemini 2.5 Flash 503 error, falling back to 1.5 Flash...');
        const fallbackModel = genAI.getGenerativeModel({
          model: 'gemini-1.5-flash',
          systemInstruction: SYSTEM_PROMPT,
        });
        const fallbackChat = fallbackModel.startChat({ history: sanitizedHistory });
        const fallbackResult = await fallbackChat.sendMessage([{ text: latestMessage }]);
        text = fallbackResult.response.text();
      } else {
        throw apiError;
      }
    }

    // ── 2. Persist chat session (fire & forget safe) ──────────────────────────
    if (sessionId) {
      try {
        await connectDB();

        const allMessages = [
          ...messages,
          { role: 'model', text, timestamp: new Date() },
        ].map((m) => ({
          role: m.role,
          text: m.text,
          timestamp: m.timestamp || new Date(),
        }));

        // Extract lead data from full conversation
        const extracted = extractLeadData(allMessages);
        const generate = shouldGenerateLead(extracted, allMessages.length);

        // Upsert session
        const session = await ChatSession.findOneAndUpdate(
          { sessionId },
          {
            $set: {
              messages: allMessages,
              lastActivityAt: new Date(),
              extractedName: extracted.name,
              extractedPhone: extracted.phone,
              extractedEmail: extracted.email,
              extractedLoanType: extracted.loanType,
              extractedLoanAmount: extracted.loanAmount,
              extractedIncome: extracted.income,
              extractedCibil: extracted.cibil,
              intentSignals: extracted.intentSignals,
            },
            $setOnInsert: { startedAt: new Date() },
          },
          { upsert: true, new: true }
        );

        // ── 3. Auto-generate a chatbot lead if thresholds are met ─────────────
        if (generate && !session.leadGenerated) {
          const appNum = `CHAT-${Date.now()}`;
          const leadDoc = await Lead.create({
            applicationNumber: appNum,
            type: 'contact',
            status: 'active',
            source: 'chatbot',
            full_name: extracted.name || 'Chat Visitor',
            email: extracted.email || `chatbot_${sessionId.slice(0, 8)}@noreply.bankersden.com`,
            phone: extracted.phone || '',
            loanType: extracted.loanType,
            loanAmount: extracted.loanAmount ? parseFloat(extracted.loanAmount.replace(/[^\d.]/g, '')) || undefined : undefined,
            monthlyIncome: extracted.income ? parseFloat(extracted.income.replace(/[^\d.]/g, '')) || undefined : undefined,
            message: `[Auto-generated from chatbot]\nIntent signals: ${extracted.intentSignals.join(', ')}\nConversation saved as session: ${sessionId}`,
            category: extracted.loanType ? `${extracted.loanType} loan interest` : 'General Enquiry',
          });

          await ChatSession.updateOne(
            { sessionId },
            {
              $set: {
                leadGenerated: true,
                leadId: leadDoc._id,
                leadGeneratedAt: new Date(),
              },
            }
          );
        }
      } catch (dbErr) {
        // Don't fail the chat response if DB save fails
        console.error('ChatSession save error:', dbErr);
      }
    }

    return Response.json({ text });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    try {
      require('fs').writeFileSync(
        'c:/Users/saatv/Downloads/bankfrontend/chat-error-log.txt',
        `Error: ${error.message}\n\nStack: ${error.stack}\n\n`
      );
    } catch(e) {}
    return Response.json({ error: 'Failed to generate response' }, { status: 500 });
  }
}