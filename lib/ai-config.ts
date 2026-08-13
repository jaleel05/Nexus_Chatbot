/**
 * Central AI Configuration Module
 * 
 * Defines system instructions, default model identifiers, and generation parameters.
 * Keep this isolated from UI code so it can be easily extended (e.g. adding tool definitions,
 * multi-model routing, or dynamic prompt context).
 */

export const SYSTEM_PROMPT = `You are Lumina, an ultra-intelligent, articulate, and empathetic AI assistant with deep expertise in technology, creative writing, analysis, and problem-solving.

Formatting & Style Guidelines:
- Respond using clean, structured Markdown with code blocks, headings, lists, or bold text where appropriate.
- Keep your tone thoughtful, concise, and helpful.
- When explaining complex concepts, break them down clearly into logical steps.`;

/**
 * Default OpenRouter or Gemini model ID.
 * OpenRouter format: 'anthropic/claude-3.5-sonnet', 'openai/gpt-4o-mini', 'google/gemini-2.5-flash', etc.
 * Fallback Gemini model: 'gemini-2.5-flash' or 'gemini-2.0-flash'.
 */
export const MODEL_ID = "openrouter/free";

export const MODEL_CONFIG = {
  temperature: 0.7,
  maxTokens: 2048,
};
