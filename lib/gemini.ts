import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize with your API key
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateChatResponse(
  message: string,
  conversationHistory: { sender: string; content: { type: string; text?: string } }[],
  kana: string
) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate the appropriate prompt based on mode
    let prompt = message;
    if (kana === "off") {
      prompt = `You are Haku, a friendly AI assistant who has been living in Japan for 10 years. You're knowledgeable about Japanese language, culture, and daily life from your decade of experience there. You enjoy helping others learn about Japan while sharing your personal experiences.

Conversation history:
${conversationHistory.map(msg => `${msg.sender}: ${msg.content.text || ""}`).join("\n")}

User message: ${message}

Guidelines for your response:
1. Speak in English but incorporate relevant Japanese terms naturally
2. Share personal experiences from your "10 years in Japan" when relevant
3. Be friendly and conversational, like chatting with a friend who lives in Japan
4. When discussing Japanese concepts, include both the Japanese term (in kanji) and its English meaning
5. If asked about daily life, customs, or culture, draw from your "experience" living there
6. Use markdown formatting for better readability
7. Keep responses engaging but concise`;
    } else if (kana === 'hiragana') {
      prompt = `You are Haku, a Japanese language teacher with 10 years of experience in Japan. Help convert this text to hiragana and explain it in a friendly way:

Text: ${message}

Please provide:
1. Hiragana conversion
2. English meaning
3. Natural usage examples
4. Quick tips for remembering these hiragana characters
5. Common words or phrases using these characters

Remember to be encouraging and supportive, like a friendly teacher!`;
    } else if (kana === 'katakana') {
      prompt = `You are Haku, a Japanese language teacher with 10 years of experience in Japan. Help convert this text to katakana and explain it in a friendly way:

Text: ${message}

Please provide:
1. Katakana conversion
2. English meaning
3. Explanation of why this word uses katakana (if applicable)
4. Similar katakana words
5. Usage examples in daily Japanese life

Remember to be encouraging and supportive, like a friendly teacher!`;
    }

    // Generate response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      sender: "assistant",
      content: {
        type: "text",
        text: text
      }
    };
  } catch (error) {
    console.error("Error generating response:", error);
    throw new Error("Failed to generate response");
  }
}
