import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini with the specific key
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export const generateBlogData = async (topic: string) => {
  if (!genAI) {
    throw new Error("Gemini API Key 2 is not configured.");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // Fast and cost-effective model

  const prompt = `
You are an expert financial writer targeting an Indian audience.
Write a high-quality, SEO-optimized blog post about the following topic: "${topic}".
Analyze current market trends and include relevant insights if possible.

Requirements:
- Ensure the tone is human-like, engaging, and professional.
- Avoid generic AI-sounding phrases. Make it sound like an expert financial advisor wrote it.
- Include a compelling Title.
- Include a concise, click-worthy Meta Description.
- Include the main content with structured sections (using Markdown formatting, like ## headings).
- Provide a highly descriptive "imagePrompt" for generating a banner image related to the blog.
- Add an FAQs section at the end.
- Include a suggested list of tags.
- Provide a clear category (e.g., "Personal Finance", "Stock Market").
- Include a realistic estimated read time in minutes (e.g., "5 min read").

IMPORTANT: Respond ONLY with a valid JSON object matching exactly this structure, with no markdown code blocks wrapping the JSON:
{
  "title": "...",
  "metaDescription": "...",
  "content": "...",
  "imagePrompt": "...",
  "tags": ["tag1", "tag2"],
  "category": "...",
  "readTime": "..."
}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    let cleanedText = text.trim();
    if (cleanedText.startsWith('```json')) cleanedText = cleanedText.substring(7);
    if (cleanedText.startsWith('```')) cleanedText = cleanedText.substring(3);
    if (cleanedText.endsWith('```')) cleanedText = cleanedText.substring(0, cleanedText.length - 3);
    cleanedText = cleanedText.trim();

    const parsedData = JSON.parse(cleanedText);
    
    if (parsedData.imagePrompt) {
      const keyword = parsedData.category ? parsedData.category.split(' ')[0] : 'finance';
      const imageUrl = `https://loremflickr.com/1200/600/business,${encodeURIComponent(keyword)}/all`;
      parsedData.content = `![Banner Image](${imageUrl})\n\n` + parsedData.content;
    }
    
    return parsedData;
  } catch (error) {
    console.error("Error generating blog content:", error);
    throw error;
  }
};
