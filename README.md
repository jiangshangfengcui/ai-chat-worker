# AI Chat Worker

这是一个 Cloudflare Worker 项目，用于处理 AI 聊天应用的 GraphQL 请求，并与 DeepSeek API 集成。

## 功能特性

- 处理 GraphQL 查询和变更操作
- 集成 DeepSeek AI 模型
- 支持 CORS 跨域请求
- 内存中消息存储（适用于演示）

## 安装和部署

1. 安装依赖：
```bash
npm install
```

2. 配置环境变量：
编辑 `wrangler.toml` 文件，设置你的 DeepSeek API 密钥：
```toml
[env.production.vars]
DEEPSEEK_API_KEY = "your_deepseek_api_key_here"
```

3. 本地开发：
```bash
npm run dev
```

4. 部署到 Cloudflare：
```bash
npm run deploy
```

## GraphQL API

### 查询 (Queries)

#### 获取所有消息
```graphql
query GetMessages {
  messages {
    id
    content
    sender
    timestamp
  }
}
```

### 变更 (Mutations)

#### 发送消息
```graphql
mutation SendMessage($content: String!, $sender: String!) {
  sendMessage(content: $content, sender: $sender) {
    id
    content
    sender
    timestamp
  }
}
```

## 使用说明

1. 前端应用需要将 GraphQL 端点设置为 Worker 的 URL + `/graphql`
2. Worker 会自动处理用户消息，并调用 DeepSeek API 生成 AI 回复
3. 支持 CORS，可以从任何域名访问

## 注意事项

- 当前使用内存存储，Worker 重启后消息会丢失
- 生产环境建议使用 Cloudflare D1 数据库或其他持久化存储
- 需要有效的 DeepSeek API 密钥