/**
 * 消息接口定义
 */
export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

/**
 * 发送消息输入接口
 */
export interface SendMessageInput {
  content: string;
  sender: string;
}

/**
 * DeepSeek API 消息格式
 */
export interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

/**
 * DeepSeek API 请求接口
 */
export interface DeepSeekRequest {
  model: string;
  messages: DeepSeekMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

/**
 * DeepSeek API 响应接口
 */
export interface DeepSeekResponse {
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Worker 环境变量接口
 */
export interface Environment {
  DEEPSEEK_API_KEY: string;
  DEEPSEEK_API_URL: string;
}
