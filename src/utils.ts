/**
 * GraphQL 查询解析工具函数
 * 用于解析和处理 GraphQL 请求
 */

/**
 * 解析 GraphQL 查询字符串
 * @param query - GraphQL 查询字符串
 * @returns 操作类型、字段名和参数
 */
export function parseGraphQLQuery(query: string): {
  operation: string;
  fieldName: string;
  args: any;
} {
  const trimmedQuery = query.trim();

  // 检查是否为查询操作
  if (trimmedQuery.includes('query') && trimmedQuery.includes('messages')) {
    return {
      operation: 'query',
      fieldName: 'messages',
      args: {},
    };
  }

  // 检查是否为变更操作
  if (trimmedQuery.includes('mutation') && trimmedQuery.includes('sendMessage')) {
    // 提取参数
    const contentMatch = trimmedQuery.match(/content:\s*"([^"]+)"/);
    const senderMatch = trimmedQuery.match(/sender:\s*"([^"]+)"/);

    return {
      operation: 'mutation',
      fieldName: 'sendMessage',
      args: {
        content: contentMatch?.[1] || '',
        sender: senderMatch?.[1] || 'user',
      },
    };
  }

  throw new Error('Unsupported GraphQL operation');
}

/**
 * 创建 GraphQL 响应格式
 * @param data - 响应数据
 * @param errors - 错误信息数组
 * @returns JSON 字符串
 */
export function createGraphQLResponse(data: any, errors?: any[]): string {
  const response: any = { data };
  
  if (errors && errors.length > 0) {
    response.errors = errors;
  }
  
  return JSON.stringify(response, null, 2);
}

/**
 * 处理 CORS 跨域请求
 * @param request - HTTP 请求对象
 * @returns CORS 响应或 null
 */
export function handleCORS(request: Request): Response | null {
  const origin = request.headers.get('Origin');

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': origin || '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  return null;
}

/**
 * 创建带有 CORS 头的响应
 * @param body - 响应体
 * @param status - HTTP 状态码
 * @param request - 原始请求对象
 * @returns 带有 CORS 头的响应
 */
export function createCORSResponse(
  body: string,
  status: number,
  request: Request
): Response {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}
