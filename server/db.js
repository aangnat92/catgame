const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    database: process.env.DB_NAME || 'catgame',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
});

// 初始化数据库表
async function initDatabase() {
    try {
        // 创建 games 表
        await pool.query(`
            CREATE TABLE IF NOT EXISTS games (
                id SERIAL PRIMARY KEY,
                user_id VARCHAR(255) DEFAULT 'default',
                started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ended_at TIMESTAMP,
                status VARCHAR(20) DEFAULT 'playing',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 创建 game_states 表
        await pool.query(`
            CREATE TABLE IF NOT EXISTS game_states (
                id SERIAL PRIMARY KEY,
                game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
                correct_count INTEGER DEFAULT 0,
                wrong_count INTEGER DEFAULT 0,
                current_instruction TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log('数据库表初始化成功');
    } catch (error) {
        console.error('数据库初始化错误:', error);
        throw error;
    }
}

// 测试数据库连接
async function testConnection() {
    try {
        const result = await pool.query('SELECT NOW()');
        console.log('数据库连接成功:', result.rows[0].now);
        return true;
    } catch (error) {
        console.error('数据库连接失败:', error);
        return false;
    }
}

module.exports = {
    pool,
    initDatabase,
    testConnection
};

