// 在前端代码中初始化 Supabase 客户端
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// 更新后端 API 的基础 URL
const API_BASE_URL = 'https://catgame-six.vercel.app/api';

// 导出 API_BASE_URL 供其他文件使用
export { API_BASE_URL };

const supabaseUrl = 'https://rohmkjxkisrisvvwtxct.supabase.co'
const supabaseAnonKey = 'rohmkjxkisrisvvwtxct'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// 示例：保存游戏分数
async function saveScore(score, playerName) {
  try {
    const { data, error } = await supabase
      .from('game_scores')
      .insert([
        { 
          player_name: playerName, 
          score: score,
          created_at: new Date()
        }
      ])
    
    if (error) throw error
    console.log('分数保存成功:', data)
  } catch (error) {
    console.error('保存失败:', error.message)
  }
}

// 示例：获取高分榜
async function getHighScores(limit = 10) {
  try {
    const { data, error } = await supabase
      .from('game_scores')
      .select('*')
      .order('score', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('获取失败:', error.message)
    return []
  }
}