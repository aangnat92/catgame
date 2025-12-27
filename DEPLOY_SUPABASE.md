# 使用 Supabase + GitHub 部署指南

## 方案概述

- **数据库**: Supabase (免费 PostgreSQL)
- **前端**: GitHub Pages 或 Vercel
- **后端**: Vercel 或 Railway

## 步骤 1: 配置 Supabase 数据库

### 1.1 创建 Supabase 项目

1. 访问 https://supabase.com
2. 登录你的账号
3. 点击 "New Project"
4. 填写项目信息：
   - Name: `cat-game` (或任意名称)
   - Database Password: 设置一个强密码（记住它！）
   - Region: 选择离你最近的区域
5. 点击 "Create new project"

### 1.2 获取数据库连接信息

项目创建后，在 Supabase 控制台：

1. 点击左侧 "Settings" → "Database"
2. 找到 "Connection string" 部分
3. 选择 "URI" 格式，复制连接字符串
   - 格式类似：`postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`
   postgresql://postgres:[YOUR-PASSWORD]@db.rohmkjxkisrisvvwtxct.supabase.co:5432/postgres

4. 或者分别获取：
   - **Host**: `db.xxxxx.supabase.co`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: 你创建项目时设置的密码

### 1.3 在 Supabase 中创建数据库表

在 Supabase 控制台：

1. 点击左侧 "SQL Editor"
2. 点击 "New query"
3. 粘贴以下 SQL（来自 `server/init-db.sql`）：

```sql
-- 创建 games 表
CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) DEFAULT 'default',
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP,
    status VARCHAR(20) DEFAULT 'playing',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建 game_states 表
CREATE TABLE IF NOT EXISTS game_states (
    id SERIAL PRIMARY KEY,
    game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
    correct_count INTEGER DEFAULT 0,
    wrong_count INTEGER DEFAULT 0,
    current_instruction TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_games_started_at ON games(started_at);
CREATE INDEX IF NOT EXISTS idx_game_states_game_id ON game_states(game_id);
```

4. 点击 "Run" 执行

## 步骤 2: 修改后端代码以支持 Supabase

Supabase 使用标准的 PostgreSQL，所以代码基本不需要修改，只需要更新连接配置。

### 2.1 更新 `.env` 文件示例

在 `server/.env.example` 中，Supabase 的连接信息应该是：

```env
DB_USER=postgres
DB_HOST=db.xxxxx.supabase.co
DB_NAME=postgres
DB_PASSWORD=your-supabase-password
DB_PORT=5432
PORT=3000
```

## 步骤 3: 部署后端到 Vercel

### 3.1 准备代码

确保你的代码已经推送到 GitHub 仓库。

### 3.2 在 Vercel 部署

1. 访问 https://vercel.com
2. 使用 GitHub 账号登录
3. 点击 "Add New Project"
4. 选择你的 GitHub 仓库
5. 配置项目：
   - **Framework Preset**: Other
   - **Root Directory**: `server` (或保持根目录，根据 vercel.json 配置)
   - **Build Command**: 留空（或 `npm install`）
   - **Output Directory**: 留空

6. 添加环境变量：
   - `DB_USER`: `postgres`
   - `DB_HOST`: `db.xxxxx.supabase.co` (你的 Supabase Host)
   - `DB_NAME`: `postgres`
   - `DB_PASSWORD`: 你的 Supabase 密码
   - `DB_PORT`: `5432`
   - `PORT`: `3000` (Vercel 会自动设置，但可以保留)

7. 点击 "Deploy"

### 3.3 获取后端 URL

部署完成后，Vercel 会给你一个 URL，例如：
- `https://your-app.vercel.app`

你的 API 地址就是：`https://your-app.vercel.app/api`

## 步骤 4: 部署前端

### 方案 A: 使用 GitHub Pages（免费）

#### 4.1 修改前端配置

在 `front/config.js` 中，设置为你部署的后端地址：

```javascript
const API_BASE_URL = 'https://your-app.vercel.app/api';  // 你的 Vercel 后端地址
```

#### 4.2 推送到 GitHub

```bash
git add .
git commit -m "Prepare for deployment"
git push
```

#### 4.3 在 GitHub 设置 Pages

1. 进入你的 GitHub 仓库
2. 点击 "Settings" → "Pages"
3. 在 "Source" 中选择：
   - Branch: `main` (或你的主分支)
   - Folder: `/front`
4. 点击 "Save"

#### 4.4 访问你的网站

GitHub 会给你一个地址：
- `https://your-username.github.io/witchcoding/`

### 方案 B: 使用 Vercel（推荐，更简单）

1. 在 Vercel 创建新项目
2. 选择同一个 GitHub 仓库
3. 配置：
   - **Root Directory**: `front`
   - **Framework Preset**: Other
4. 部署

## 步骤 5: 测试部署

1. 访问你的前端地址
2. 测试游戏功能
3. 检查浏览器控制台是否有错误
4. 检查后端日志（在 Vercel Dashboard）

## 故障排除

### 数据库连接失败

- 检查 Supabase 项目是否正常运行
- 检查环境变量是否正确
- 检查 Supabase 的 IP 白名单设置（可能需要允许所有 IP）

### CORS 错误

在 `server/server.js` 中，确保 CORS 配置允许你的前端域名：

```javascript
app.use(cors({
    origin: [
        'https://your-username.github.io',
        'https://your-frontend.vercel.app',
        'http://localhost:8000'  // 本地开发
    ]
}));
```

### API 404 错误

检查 Vercel 的路由配置是否正确，确保 `/api/*` 路由指向后端。

## 更新代码

每次更新代码后：

1. 推送到 GitHub
2. Vercel 会自动重新部署后端
3. GitHub Pages 或 Vercel 会自动重新部署前端

## 成本

- ✅ Supabase: 免费（有使用限制，但足够小项目使用）
- ✅ GitHub Pages: 免费
- ✅ Vercel: 免费（有使用限制，但足够小项目使用）

总计：**完全免费**！

