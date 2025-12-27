# 快速启动指南

## 前置要求

- Node.js (v14 或更高版本)
- PostgreSQL (已安装并运行)
- npm 或 yarn

## 快速开始

### 1. 创建数据库

在 PostgreSQL 中创建数据库：

```bash
psql -U postgres
CREATE DATABASE catgame;
\q
```

### 2. 安装后端依赖

```bash
cd server
npm install
```

### 3. 配置环境变量

在 `server` 目录下创建 `.env` 文件：

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=catgame
DB_PASSWORD=your_password
DB_PORT=5432
PORT=3000
```

### 4. 启动后端服务器

```bash
cd server
npm start
```

服务器将在 `http://localhost:3000` 启动。

### 5. 启动前端

有几种方式：

**方式一：使用 Python（推荐）**

```bash
cd front
python -m http.server 8000
```

然后在浏览器访问 `http://localhost:8000`

**方式二：使用 Node.js http-server**

```bash
npx http-server front -p 8000
```

**方式三：直接打开文件**

直接用浏览器打开 `front/index.html`（需要确保后端服务器正在运行）

### 6. 开始游戏

1. 在浏览器中打开前端页面
2. 输入指令（如"选择纸巾"或"选择胡萝卜"）
3. 点击"设置指令"
4. 点击"开始新游戏"
5. 根据指令点击对应的选项
6. 享受游戏！

## 故障排除

### 数据库连接失败

- 检查 PostgreSQL 是否正在运行
- 确认 `.env` 文件中的数据库配置正确
- 确认数据库 `catgame` 已创建

### 前端无法连接后端

- 确认后端服务器正在运行（检查 `http://localhost:3000/health`）
- 如果使用不同的端口，修改 `front/script.js` 中的 `API_BASE_URL`
- 检查浏览器控制台是否有 CORS 错误

### 游戏逻辑问题

- 检查浏览器控制台和后端控制台的错误信息
- 确认数据库表已正确创建（服务器启动时会自动创建）

