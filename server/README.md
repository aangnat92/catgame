# 后端服务器

## 安装依赖

```bash
npm install
```

## 配置数据库

1. 创建 `.env` 文件（参考 `.env.example`）
2. 配置数据库连接信息

## 运行服务器

```bash
npm start
```

开发模式（自动重启）：

```bash
npm run dev
```

## 数据库初始化

服务器启动时会自动创建所需的表。也可以手动运行：

```bash
psql -U postgres -d catgame -f init-db.sql
```

