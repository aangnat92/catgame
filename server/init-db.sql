-- 创建数据库（如果不存在，需要在 PostgreSQL 中手动创建）
-- CREATE DATABASE catgame;

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

