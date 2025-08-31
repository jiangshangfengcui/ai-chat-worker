import { GraphQLResolver } from './resolver';
import { 
  parseGraphQLQuery,  
  createGraphQLResponse,
  handleCORS,
  createCORSResponse
} from './utils';
import { Environment } from './types'
/**
 * Cloudflare Worker 主入口点
 * 处理所有传入的 HTTP 请求并路由到相应的处理器
 */
export default {
  /**
   * Fetch 事件处理器
   *  @param request - HTTP 请求对象
   * @param env - 环境变量
   * @returns HTTP 响应
   */
  async fetch(request: Request, env: Environment): Promise<Response> {
    console.log('进入服务')
    try {
      // 处理 CORS 预检请求
      const corsResponse = handleCORS(request);
      if (corsResponse) {
        return corsResponse;
      }
      // 检查请求方法和路径
      if (request.method !== 'POST') {
        return createCORSResponse(
          JSON.stringify({ error: '不允许的方法' }),
          405,
          request
        );
      }
      if (!request.url.includes('/graphql')) {
        return createCORSResponse(
          JSON.stringify({ error: '路径不对' }),
          404,
          request
        );
      }
      console.log(env)
      console.log('deepseek KEY-URL', env.DEEPSEEK_API_KEY, env.DEEPSEEK_API_URL)
      // 验证环境变量
      if (!env.DEEPSEEK_API_KEY || !env.DEEPSEEK_API_URL) {
        console.error('Missing required environment variables');
        return createCORSResponse(
          createGraphQLResponse(null, [
            { message: 'Server configuration error' },
          ]),
          500,
          request
        );
      }
      
      // 解析请求体
      const body = await request.json();
      const { query, variables } = body;
      if (!query) {
        return createCORSResponse(
          createGraphQLResponse(null, [{ message: 'Query is required' }]),
          400,
          request
        );
      }
      // 解析 GraphQL 查询
      const { operation, fieldName, args } = parseGraphQLQuery(query);
      // 合并查询中的参数和变量
      const finalArgs = { ...args, ...variables };
      // 创建解析器实例
      const resolver = new GraphQLResolver(env);
      let result;
      if (operation === 'query') {
        result = await resolver.resolveQuery(fieldName, finalArgs);
        result = { [fieldName]: result };
      } else if (operation === 'mutation') {
        result = await resolver.resolveMutation(fieldName, finalArgs);
        result = { [fieldName]: result };
      } else {
        throw new Error('Unsupported operation type');
      }
      return createCORSResponse(
        createGraphQLResponse(result),
        200,
        request
      );
    } catch (error) {
      console.error('GraphQL processing error:', error);
      const errorMessage =
      error instanceof Error ? error.message : 'Internal server error';
      return createCORSResponse(
        createGraphQLResponse(null, [{ message: errorMessage }]),
        500,
        request
      );
    }
  },
};
