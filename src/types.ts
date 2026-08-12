/**
 * Shared Type Definitions for Chat Application
 */

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt?: Date;
}

export interface AIConfig {
  systemPrompt: string;
  modelId: string;
  temperature: number;
  maxTokens: number;
}

export type ChatStatus = 'idle' | 'submitted' | 'streaming' | 'error' | 'ready';
