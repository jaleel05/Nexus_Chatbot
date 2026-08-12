import { streamText, convertToModelMessages } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { SYSTEM_PROMPT, MODEL_ID, MODEL_CONFIG } from "../../../lib/ai-config";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    const openrouterKey = process.env.OPENROUTER_API_KEY;
    const defaultGeminiKey = 'AIzaSyCuj9IcdXnex_7Llh_77S3pRwK3A8Z3-Uk';

    let modelProvider;

    // Use OpenRouter if OPENROUTER_API_KEY is set and is an OpenRouter key (starts with sk-or- or not AIzaSy)
    if (openrouterKey && openrouterKey.startsWith('sk-or-')) {
      const openrouter = createOpenRouter({
        apiKey: openrouterKey,
      });
      modelProvider = openrouter(MODEL_ID);
    } else {
      // Fallback to Google Gemini provider using default AI Studio key
      const apiKey = (openrouterKey && openrouterKey.startsWith('AIzaSy'))
        ? openrouterKey
        : defaultGeminiKey;

      const google = createGoogleGenerativeAI({
        apiKey: apiKey,
      });

      // Extract model name safely (e.g., 'google/gemini-2.5-flash' -> 'gemini-2.5-flash')
      let googleModel = 'gemini-2.5-flash';
      if (MODEL_ID.includes('/')) {
        const parts = MODEL_ID.split('/');
        googleModel = parts[parts.length - 1];
      } else if (MODEL_ID) {
        googleModel = MODEL_ID;
      }

      if (!googleModel.startsWith('gemini')) {
        googleModel = 'gemini-2.5-flash';
      }

      modelProvider = google(googleModel);
    }

    // Format incoming UI messages so convertToModelMessages receives expected parts structure
    const formattedMessages = (messages || []).map((m: any) => {
      if (!m.parts && m.content) {
        return {
          ...m,
          parts: [{ type: 'text', text: typeof m.content === 'string' ? m.content : JSON.stringify(m.content) }],
        };
      }
      return m;
    });

    const modelMessages = await convertToModelMessages(formattedMessages);

    const result = streamText({
      model: modelProvider,
      system: SYSTEM_PROMPT,
      messages: modelMessages,
      temperature: MODEL_CONFIG.temperature,
      maxOutputTokens: MODEL_CONFIG.maxTokens,
    });

    return result.toUIMessageStreamResponse();
  } catch (error: unknown) {
    console.error('API Chat Route Error Stack:', error);
    const errorMessage = error instanceof Error ? error.message : 'An error occurred processing your request.';
    return new Response(JSON.stringify({ error: errorMessage }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

