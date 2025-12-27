# 后端安装和配置指南

## 步骤 1: 安装后端依赖

在项目根目录下，打开终端（PowerShell 或 CMD），执行以下命令：

```bash
cd server
npm install
```

**如果遇到 PowerShell 执行策略错误**（错误信息包含 "禁止运行脚本"），有以下解决方案：

### 解决方案 1: 使用 CMD（最简单，推荐）

1. 按 `Win + R`，输入 `cmd`，按回车
2. 在 CMD 中执行（**注意：需要先切换到 F: 盘**）：
```bash
F:
cd \code\witchcoding\server
npm install
```

**或者使用完整路径（推荐）：**
```bash
cd /d F:\code\witchcoding\server
npm install
```

**或者直接双击运行 `server/INSTALL.bat` 文件**（我已经为你创建了这个批处理文件）

### 解决方案 2: 修改 PowerShell 执行策略

以**管理员身份**打开 PowerShell，执行：
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
然后输入 `Y` 确认。完成后重新执行 `npm install`。

### 解决方案 3: 在 PowerShell 中使用 npm.cmd

在 PowerShell 中，使用完整路径：
```powershell
cd server
& "D:\Program Files\nodejs\npm.cmd" install
```

或者临时绕过执行策略（仅当前会话）：
```powershell
cd server
powershell -ExecutionPolicy Bypass -Command "npm install"
```

这会安装以下依赖包：
- express - Web 服务器框架
- cors - 跨域资源共享
- pg - PostgreSQL 数据库客户端
- dotenv - 环境变量管理
- nodemon - 开发时自动重启（可选）

**如果 npm install 很慢，可以使用国内镜像：**
```bash
npm install --registry=https://registry.npmmirror.com
```

## 步骤 2: 配置 PostgreSQL 数据库

### 2.1 确保 PostgreSQL 已安装并运行

- 如果还没安装 PostgreSQL，请先下载安装：https://www.postgresql.org/download/windows/
- 确保 PostgreSQL 服务正在运行（可以在 Windows 服务中查看）

### 2.2 创建数据库

打开 PostgreSQL 的命令行工具（psql）或使用 pgAdmin：

**方法一：使用 psql 命令行**
```bash
# 以 postgres 用户登录
psql -U postgres

# 在 psql 中执行
CREATE DATABASE catgame;

# 退出
\q
```

**方法二：使用 pgAdmin**
1. 打开 pgAdmin
2. 右键点击 "Databases" -> "Create" -> "Database"
3. 数据库名称填写：`catgame`
4. 点击 "Save"

### 2.3 创建环境变量配置文件

在 `server` 目录下创建 `.env` 文件（注意文件名前面有个点），内容如下：

```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=catgame
DB_PASSWORD=你的PostgreSQL密码
DB_PORT=5432
PORT=3000
```

**重要提示：**
- `DB_HOST=localhost` - **直接写 `localhost` 即可**，不需要修改。`localhost` 表示本机（你的电脑）
- `DB_USER=postgres` - 通常是 `postgres`，如果安装时设置了其他用户名，则修改
- `DB_NAME=catgame` - 数据库名称，保持 `catgame` 即可
- `DB_PASSWORD=你的PostgreSQL密码` - **这里需要替换**为你安装 PostgreSQL 时设置的密码
- `DB_PORT=5432` - PostgreSQL 默认端口，通常不需要修改
- `PORT=3000` - 后端服务器端口，可以保持 3000 或改成其他端口

**示例（假设你的密码是 `mypassword123`）：**
```env
DB_USER=postgres
DB_HOST=localhost
DB_NAME=catgame
DB_PASSWORD=mypassword123
DB_PORT=5432
PORT=3000
```

**在 Windows 中创建 .env 文件的方法：**
1. 在 `server` 目录下，打开 PowerShell
2. 执行：`New-Item -Path .env -ItemType File`
3. 用记事本或 VS Code 打开 `.env` 文件，粘贴上面的内容并修改密码

## 步骤 3: 启动后端服务器

### 3.1 启动服务器

在 `server` 目录下执行：

```bash
npm start
```

如果看到以下输出，说明启动成功：
```
数据库连接成功: ...
数据库表初始化成功
服务器运行在 http://localhost:3000
健康检查: http://localhost:3000/health
```

### 3.2 测试服务器

打开浏览器访问：`http://localhost:3000/health`

如果看到 `{"status":"ok","message":"服务器运行正常"}`，说明服务器运行正常。

### 3.3 开发模式（可选）

如果想在开发时自动重启服务器（修改代码后自动重启），可以使用：

```bash
npm run dev
```

**注意：** 首次使用需要安装 nodemon：
```bash
npm install -g nodemon
# 或者
npm install nodemon --save-dev
```

## 常见问题

### 问题 1: PowerShell 执行策略错误

**错误信息：** `无法加载文件 ... npm.ps1，因为在此系统上禁止运行脚本`

**解决方案：**
1. **最简单方法：使用 CMD 而不是 PowerShell**
   - 按 `Win + R`，输入 `cmd`，按回车
   - 在 CMD 中执行命令

2. **修改 PowerShell 执行策略（推荐）**
   - 以**管理员身份**打开 PowerShell
   - 执行：`Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`
   - 输入 `Y` 确认

3. **临时绕过（仅当前会话）**
   ```powershell
   powershell -ExecutionPolicy Bypass -Command "npm install"
   ```

### 问题 2: npm install 失败

**解决方案：**
- 确保已安装 Node.js（版本 14 或更高）
- 检查网络连接
- 尝试清除缓存：`npm cache clean --force`
- 使用国内镜像：`npm install --registry=https://registry.npmmirror.com`

### 问题 3: 数据库连接失败

**错误信息：** `数据库连接失败: ...`

**解决方案：**
1. 检查 PostgreSQL 服务是否运行
   - 打开 Windows 服务管理器（services.msc）
   - 查找 "postgresql" 服务，确保状态为"正在运行"
2. 检查 `.env` 文件中的配置是否正确
   - 用户名、密码、数据库名是否正确
   - 端口号是否正确（默认 5432）
3. 检查防火墙是否阻止了连接
4. 尝试手动连接测试：
   ```bash
   psql -U postgres -d catgame
   ```

### 问题 4: 端口 3000 已被占用

**错误信息：** `Error: listen EADDRINUSE: address already in use :::3000`

**解决方案：**
1. 修改 `.env` 文件中的 `PORT=3000` 为其他端口，如 `PORT=3001`
2. 或者关闭占用 3000 端口的程序

### 问题 5: 找不到 .env 文件

**解决方案：**
- 确保 `.env` 文件在 `server` 目录下
- 确保文件名是 `.env`（注意前面有个点，没有扩展名）
- 在 Windows 中，如果看不到以点开头的文件，需要在文件资源管理器中启用"显示隐藏文件"

## 下一步

后端服务器启动成功后，可以：
1. 启动前端（参考 `QUICKSTART.md`）
2. 开始游戏！

