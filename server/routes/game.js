const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// 开始新游戏
router.post('/start', async (req, res) => {
    try {
        const { instruction } = req.body;
        
        // 创建新游戏
        const gameResult = await pool.query(
            'INSERT INTO games (status) VALUES ($1) RETURNING id',
            ['playing']
        );
        const gameId = gameResult.rows[0].id;
        
        // 创建游戏状态
        await pool.query(
            'INSERT INTO game_states (game_id, correct_count, wrong_count, current_instruction) VALUES ($1, $2, $3, $4)',
            [gameId, 0, 0, instruction || '等待指令']
        );
        
        res.json({
            success: true,
            gameId: gameId
        });
    } catch (error) {
        console.error('启动游戏错误:', error);
        res.status(500).json({
            success: false,
            error: '启动游戏失败'
        });
    }
});

// 提交选择
router.post('/choice', async (req, res) => {
    try {
        const { gameId, instruction, choice } = req.body;
        
        if (!gameId || !instruction || !choice) {
            return res.status(400).json({
                success: false,
                error: '缺少必要参数'
            });
        }
        
        // 获取当前游戏状态
        const stateResult = await pool.query(
            'SELECT * FROM game_states WHERE game_id = $1 ORDER BY updated_at DESC LIMIT 1',
            [gameId]
        );
        
        if (stateResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: '游戏不存在'
            });
        }
        
        const gameState = stateResult.rows[0];
        
        // 检查游戏是否已结束
        if (gameState.correct_count >= 3 || gameState.wrong_count >= 5) {
            return res.json({
                success: true,
                isCorrect: false,
                correctCount: gameState.correct_count,
                wrongCount: gameState.wrong_count,
                status: gameState.correct_count >= 3 ? 'win' : 'lose',
                message: '游戏已结束'
            });
        }
        
        // 判断选择是否正确
        // 检查指令中是否包含"纸巾"或"胡萝卜"
        // 优先匹配完整关键词
        const hasTissue = instruction.includes('纸巾');
        const hasCarrot = instruction.includes('胡萝卜');
        // 如果没有完整关键词，检查部分匹配
        const hasTissuePartial = !hasTissue && (instruction.includes('纸') && !instruction.includes('胡萝卜'));
        const hasCarrotPartial = !hasCarrot && (instruction.includes('萝卜') || instruction.includes('胡萝卜'));
        
        const isTissueInstruction = hasTissue || hasTissuePartial;
        const isCarrotInstruction = hasCarrot || hasCarrotPartial;
        
        let isCorrect = false;
        if (isTissueInstruction && !isCarrotInstruction && choice === 'tissue') {
            isCorrect = true;
        } else if (isCarrotInstruction && !isTissueInstruction && choice === 'carrot') {
            isCorrect = true;
        } else if (!isTissueInstruction && !isCarrotInstruction) {
            // 如果指令不明确，默认认为选择正确（避免误判）
            isCorrect = true;
        }
        
        // 更新游戏状态
        let newCorrectCount = gameState.correct_count;
        let newWrongCount = gameState.wrong_count;
        let status = 'playing';
        
        if (isCorrect) {
            newCorrectCount = gameState.correct_count + 1;
            if (newCorrectCount >= 3) {
                status = 'win';
                // 更新游戏结束时间
                await pool.query(
                    'UPDATE games SET ended_at = CURRENT_TIMESTAMP, status = $1 WHERE id = $2',
                    ['win', gameId]
                );
            }
        } else {
            newWrongCount = gameState.wrong_count + 1;
            if (newWrongCount >= 5) {
                status = 'lose';
                // 更新游戏结束时间
                await pool.query(
                    'UPDATE games SET ended_at = CURRENT_TIMESTAMP, status = $1 WHERE id = $2',
                    ['lose', gameId]
                );
            }
        }
        
        // 更新游戏状态记录
        await pool.query(
            'UPDATE game_states SET correct_count = $1, wrong_count = $2, current_instruction = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4',
            [newCorrectCount, newWrongCount, instruction, gameState.id]
        );
        
        res.json({
            success: true,
            isCorrect: isCorrect,
            correctCount: newCorrectCount,
            wrongCount: newWrongCount,
            status: status
        });
    } catch (error) {
        console.error('提交选择错误:', error);
        res.status(500).json({
            success: false,
            error: '提交选择失败'
        });
    }
});

// 获取游戏状态
router.get('/state', async (req, res) => {
    try {
        const { gameId } = req.query;
        
        if (!gameId) {
            return res.status(400).json({
                success: false,
                error: '缺少游戏ID'
            });
        }
        
        const stateResult = await pool.query(
            'SELECT * FROM game_states WHERE game_id = $1 ORDER BY updated_at DESC LIMIT 1',
            [gameId]
        );
        
        if (stateResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                error: '游戏不存在'
            });
        }
        
        const gameState = stateResult.rows[0];
        
        // 确定游戏状态
        let status = 'playing';
        if (gameState.correct_count >= 3) {
            status = 'win';
        } else if (gameState.wrong_count >= 5) {
            status = 'lose';
        }
        
        res.json({
            success: true,
            correctCount: gameState.correct_count,
            wrongCount: gameState.wrong_count,
            status: status,
            currentInstruction: gameState.current_instruction
        });
    } catch (error) {
        console.error('获取游戏状态错误:', error);
        res.status(500).json({
            success: false,
            error: '获取游戏状态失败'
        });
    }
});

// 获取游戏历史
router.get('/history', async (req, res) => {
    try {
        const { limit = 10 } = req.query;
        
        const result = await pool.query(
            `SELECT g.id, g.started_at, g.ended_at, g.status,
                    gs.correct_count, gs.wrong_count
             FROM games g
             LEFT JOIN game_states gs ON g.id = gs.game_id
             ORDER BY g.started_at DESC
             LIMIT $1`,
            [limit]
        );
        
        res.json({
            success: true,
            games: result.rows
        });
    } catch (error) {
        console.error('获取游戏历史错误:', error);
        res.status(500).json({
            success: false,
            error: '获取游戏历史失败'
        });
    }
});

module.exports = router;

