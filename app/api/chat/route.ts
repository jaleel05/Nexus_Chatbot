import { streamText, convertToModelMessages } from 'ai';
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { SYSTEM_PROMPT, MODEL_ID, MODEL_CONFIG } from "../../../lib/ai-config";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages } = body;

    const openrouterKey = process.env.OPENROUTER_API_KEY;

    if (!openrouterKey) {
      throw new Error("OPENROUTER_API_KEY is missing from environment variables.");
    }

    const openrouter = createOpenRouter({
      apiKey: openrouterKey,
    });

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
      model: openrouter(MODEL_ID),
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