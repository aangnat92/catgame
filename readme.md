# 小猫选择游戏

一个有趣的网页游戏，让小猫根据指令选择纸巾或胡萝卜。

## 技术栈

- **前端**: HTML, CSS, JavaScript
- **后端**: Node.js, Express
- **数据库**: PostgreSQL

## 游戏规则

- 用户输入指令（如"选择纸巾"或"选择胡萝卜"）
- 小猫根据用户点击做出选择
- 选择正确：获得"蒸蚌"（需要3个才能获胜）
- 选择错误：被轻拍头部（最多5次，超过则失败）
- 胜利条件：在5次错误内获得3个"蒸蚌"
- 失败条件：错误达到5次

## 项目结构

```
witchcoding/
├── front/              # 前端文件
│   ├── index.html     # 游戏界面
│   ├── style.css      # 样式文件
│   └── script.js      # 游戏逻辑
├── server/            # 后端文件
│   ├── server.js      # 服务器入口
│   ├── db.js          # 数据库配置
│   ├── routes/        # 路由文件
│   │   └── game.js    # 游戏API
│   ├── package.json   # 依赖配置
│   └── init-db.sql    # 数据库初始化脚本
└── readme.md          # 项目说明
```

## 安装和运行

### 1. 数据库设置

首先确保已安装 PostgreSQL，然后创建数据库：

```sql
CREATE DATABASE catgame;
```

运行初始化脚本（可选，服务器启动时会自动创建表）：

```bash
psql -U postgres -d catgame -f server/init-db.sql
```

### 2. 后端设置

进入 server 目录，安装依赖：

```bash
cd server
npm install
```

创建 `.env` 文件（参考 `.env.example`）：

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=catgame
DB_PASSWORD=your_password
DB_PORT=5432
PORT=3000
```

启动服务器：

```bash
npm start
# 或使用开发模式（需要安装 nodemon）
npm run dev
```

### 3. 前端设置

前端是纯静态文件，可以直接用浏览器打开 `front/index.html`，或者使用本地服务器：

```bash
# 使用 Python
cd front
python -m http.server 8000

# 或使用 Node.js http-server
npx http-server front -p 8000
```

然后在浏览器中访问 `http://localhost:8000`

**注意**: 如果直接打开 HTML 文件，需要修改 `front/script.js` 中的 `API_BASE_URL` 为后端服务器地址。

## API 接口

- `POST /api/game/start` - 开始新游戏
- `POST /api/game/choice` - 提交选择
- `GET /api/game/state` - 获取游戏状态
- `GET /api/game/history` - 获取游戏历史

## 游戏说明

1. 输入指令（如"选择纸巾"或"选择胡萝卜"）
2. 点击"设置指令"按钮
3. 点击"开始新游戏"按钮
4. 根据指令点击对应的选项（纸巾或胡萝卜）
5. 如果选择正确，小猫会获得"蒸蚌"
6. 如果选择错误，小猫会被轻拍头部
7. 获得3个"蒸蚌"即可获胜，错误5次则失败
