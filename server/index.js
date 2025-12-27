// 使用服务端密钥（更安全）
const { createClient } = require('@supabase/supabase-js')

// 从环境变量读取
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// 示例：安全的API端点
app.post('/api/save-score', async (req, res) => {
  try {
    // 这里可以添加验证逻辑
    const { score, playerName, userId } = req.body
    
    const { data, error } = await supabase
      .from('game_scores')
      .insert([{ 
        user_id: userId,
        player_name: playerName, 
        score: score 
      }])
    
    if (error) throw error
    res.json({ success: true, data })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})