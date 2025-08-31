import { Message, SendMessageInput, Environment } from './types';

const messages: Message[] = [
  {
    id: '1',
    content: '您好！我是AI助手，很高兴为您服务！',
    sender: 'ai',
    timestamp: new Date().toISOString()
  }
];

export class GraphQLResolver {
  constructor(private env: Environment) {}

  async resolveQuery(fieldName: string, args: any): Promise<any> {
    switch (fieldName) {
      case 'messages':
        return messages;
      default:
        throw new Error(`Unknown query field: ${fieldName}`);
    }
  }

  async resolveMutation(fieldName: string, args: any): Promise<any> {
    switch (fieldName) {
      case 'sendMessage':
        return await this.sendMessage(args);
      default:
        throw new Error(`Unknown mutation field: ${fieldName}`);
    }
  }

  private async sendMessage(args: SendMessageInput): Promise<Message> {
    const userMessage: Message = {
      id: Date.now().toString(),
      content: args.content,
      sender: args.sender,
      timestamp: new Date().toISOString()
    };

    messages.push(userMessage);

    // 如果是用户消息，调用DeepSeek API生成AI回复
    if (args.sender === 'user') {
      try {
        const aiResponse = await this.getAIResponse(args.content);
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: aiResponse,
          sender: 'ai',
          timestamp: new Date().toISOString()
        };
        messages.push(aiMessage);
        return aiMessage;
      } catch (error) {
        console.error('DeepSeek API error:', error);
        // 如果AI调用失败，返回默认回复
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: '抱歉，我暂时无法处理您的请求，请稍后再试。',
          sender: 'ai',
          timestamp: new Date().toISOString()
        };
        messages.push(fallbackMessage);
        return fallbackMessage;
      }
    }

    return userMessage;
  }

  private async getAIResponse(userMessage: string): Promise<string> {
    const response = await fetch(this.env.DEEPSEEK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.env.DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一个友好且有用的AI助手，请用中文回答用户的问题。'
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data.choices[0]?.message?.content)
    return data.choices[0]?.message?.content || '抱歉，我无法生成回复。';
  }
}