// API_BASE_URL 在 config.js 中定义

// 箭头角度配置（可以在这里修改角度）
const ARROW_ANGLES = {
    default: 90,      // 初始方向：向下（正南）
    tissue: 120,      // 选择纸巾：南偏西30° (180 + 30)
    carrot: 60       // 选择胡萝卜：南偏东30° (180 - 30)
};

let currentGameId = null;
let currentInstruction = null;
let gameState = {
    correctCount: 0,
    wrongCount: 0,
    status: 'playing'
};
let pendingWin = false; // 标记是否等待拖拽蒸蚌后显示胜利

// DOM 元素
const instructionTissueBtn = document.getElementById('instruction-tissue');
const instructionCarrotBtn = document.getElementById('instruction-carrot');
const currentInstructionDisplay = document.getElementById('current-instruction');
const correctCountDisplay = document.getElementById('correct-count');
const wrongCountDisplay = document.getElementById('wrong-count');
const choiceTissue = document.getElementById('choice-tissue');
const choiceCarrot = document.getElementById('choice-carrot');
const cat = document.getElementById('cat');
const catFur = document.getElementById('cat-fur');
const arrow = document.getElementById('arrow');
const catContainer = document.getElementById('cat-container');
const rewardsContainer = document.getElementById('rewards');
const gameResult = document.getElementById('game-result');
const startGameBtn = document.getElementById('start-game-btn');

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    instructionTissueBtn.addEventListener('click', () => setInstruction('选择纸巾'));
    instructionCarrotBtn.addEventListener('click', () => setInstruction('选择胡萝卜'));
    startGameBtn.addEventListener('click', startNewGame);
    
    // 设置箭头初始角度
    arrow.style.transform = `rotate(${ARROW_ANGLES.default}deg)`;
    
    loadGameState();
});

// 设置指令
async function setInstruction(instruction) {
    currentInstruction = instruction;
    currentInstructionDisplay.textContent = `当前指令: ${instruction}`;
    
    // 更新按钮状态
    if (instruction === '选择纸巾') {
        instructionTissueBtn.classList.add('selected');
        instructionCarrotBtn.classList.remove('selected');
    } else {
        instructionCarrotBtn.classList.add('selected');
        instructionTissueBtn.classList.remove('selected');
    }
    
    // 如果游戏未开始，先开始游戏
    if (!currentGameId) {
        await startNewGame();
        // 游戏开始后自动让小猫选择
        if (gameState.status === 'playing') {
            await letCatChoose();
        }
    } else {
        // 如果游戏已开始，自动让小猫选择
        if (gameState.status === 'playing') {
            await letCatChoose();
        }
    }
}

// 开始新游戏
async function startNewGame() {
    try {
        const response = await fetch(`${API_BASE_URL}/game/start`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                instruction: currentInstruction || '等待指令'
            })
        });
        
        if (!response.ok) {
            throw new Error('启动游戏失败');
        }
        
        const data = await response.json();
        currentGameId = data.gameId;
        gameState = {
            correctCount: 0,
            wrongCount: 0,
            status: 'playing'
        };
        
        updateDisplay();
        gameResult.classList.add('hidden');
        rewardsContainer.innerHTML = '';
        cat.classList.remove('angry', 'happy', 'receiving-reward');
        resetArrow();
    } catch (error) {
        console.error('启动游戏错误:', error);
        alert('启动游戏失败，请检查服务器连接');
    }
}

// 让小猫随机选择
async function letCatChoose() {
    if (!currentInstruction) {
        alert('请先设置指令！');
        return;
    }
    
    if (!currentGameId) {
        alert('请先开始游戏！');
        return;
    }
    
    if (gameState.status !== 'playing') {
        return;
    }
    
    // 禁用指令按钮
    instructionTissueBtn.disabled = true;
    instructionCarrotBtn.disabled = true;
    
    // 小猫随机选择（50%概率）
    const randomChoice = Math.random() < 0.5 ? 'tissue' : 'carrot';
    
    // 显示小猫正在思考
    currentInstructionDisplay.textContent = '小猫正在思考...';
    
    // 延迟一下，增加悬念
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // 小猫做出选择，手部指向
    pointToChoice(randomChoice);
    
    // 再延迟一下，让用户看到指向
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 提交选择
    await makeChoice(randomChoice);
}

// 小猫指向选择
function pointToChoice(choice) {
    resetArrow();
    
    if (choice === 'tissue') {
        // 设置箭头角度（纸巾）
        arrow.style.transform = `rotate(${ARROW_ANGLES.tissue}deg)`;
        choiceTissue.classList.add('highlighted');
    } else {
        // 设置箭头角度（胡萝卜）
        arrow.style.transform = `rotate(${ARROW_ANGLES.carrot}deg)`;
        choiceCarrot.classList.add('highlighted');
    }
}

// 重置箭头位置
function resetArrow() {
    arrow.style.transform = `rotate(${ARROW_ANGLES.default}deg)`;
    choiceTissue.classList.remove('highlighted');
    choiceCarrot.classList.remove('highlighted');
}

// 做出选择（提交到服务器）
async function makeChoice(choice) {
    try {
        const response = await fetch(`${API_BASE_URL}/game/choice`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                gameId: currentGameId,
                instruction: currentInstruction,
                choice: choice
            })
        });
        
        if (!response.ok) {
            throw new Error('提交选择失败');
        }
        
        const data = await response.json();
        const isCorrect = data.isCorrect;
        
        if (isCorrect) {
            handleCorrectChoice();
        } else {
            handleWrongChoice();
        }
        
        // 更新游戏状态
        gameState.correctCount = data.correctCount;
        gameState.wrongCount = data.wrongCount;
        gameState.status = data.status;
        
        updateDisplay();
        checkGameEnd();
        
        // 延迟后重置箭头，准备下一次选择
        setTimeout(() => {
            resetArrow();
            if (gameState.status === 'playing' && currentInstruction) {
                instructionTissueBtn.disabled = false;
                instructionCarrotBtn.disabled = false;
                currentInstructionDisplay.textContent = `当前指令: ${currentInstruction}`;
            }
        }, 2000);
        
    } catch (error) {
        console.error('提交选择错误:', error);
        alert('提交选择失败，请检查服务器连接');
        resetArrow();
        instructionTissueBtn.disabled = false;
        instructionCarrotBtn.disabled = false;
    }
}

// 处理正确选择
function handleCorrectChoice() {
    // 在奖励区域添加可拖拽的蒸蚌
    const reward = document.createElement('div');
    reward.className = 'reward-item';
    reward.textContent = '🦪';
    reward.draggable = true;
    
    // 设置拖拽事件
    setupRewardDrag(reward);
    
    rewardsContainer.appendChild(reward);
    
    // 小猫开心动画
    cat.classList.add('happy');
    setTimeout(() => {
        cat.classList.remove('happy');
    }, 500);
}

// 设置蒸蚌拖拽功能
function setupRewardDrag(rewardElement) {
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    
    rewardElement.addEventListener('mousedown', (e) => {
        isDragging = true;
        rewardElement.classList.add('dragging');
        
        const rect = rewardElement.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;
        
        rewardElement.style.position = 'fixed';
        rewardElement.style.pointerEvents = 'none';
        rewardElement.style.zIndex = '1000';
        
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        
        e.preventDefault();
    });
    
    function handleMouseMove(e) {
        if (!isDragging) return;
        
        rewardElement.style.left = (e.clientX - dragOffset.x) + 'px';
        rewardElement.style.top = (e.clientY - dragOffset.y) + 'px';
    }
    
    function handleMouseUp(e) {
        if (!isDragging) return;
        
        isDragging = false;
        rewardElement.classList.remove('dragging');
        
        // 检查是否拖到小猫位置
        const catRect = catContainer.getBoundingClientRect();
        const rewardRect = rewardElement.getBoundingClientRect();
        
        const catCenterX = catRect.left + catRect.width / 2;
        const catCenterY = catRect.top + catRect.height / 2;
        const rewardCenterX = rewardRect.left + rewardRect.width / 2;
        const rewardCenterY = rewardRect.top + rewardRect.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(catCenterX - rewardCenterX, 2) + 
            Math.pow(catCenterY - rewardCenterY, 2)
        );
        
        // 如果距离小于100px，认为成功给予奖励
        if (distance < 100) {
            rewardElement.classList.add('dropped');
            cat.classList.add('receiving-reward');
            
            setTimeout(() => {
                rewardElement.remove();
                cat.classList.remove('receiving-reward');
                
                // 检查是否应该显示胜利
                if (pendingWin) {
                    pendingWin = false;
                    showWinResult();
                }
            }, 800);
        } else {
            // 回到原位置
            rewardElement.style.position = '';
            rewardElement.style.left = '';
            rewardElement.style.top = '';
            rewardElement.style.pointerEvents = '';
            rewardElement.style.zIndex = '';
        }
        
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }
}

// 处理错误选择
function handleWrongChoice() {
    // 拍头动画
    cat.classList.add('hit');
    setTimeout(() => {
        cat.classList.remove('hit');
    }, 300);
}

// 检查游戏结束
function checkGameEnd() {
    if (gameState.status === 'win') {
        // 不立即显示胜利，等待拖拽蒸蚌
        pendingWin = true;
    } else if (gameState.status === 'lose') {
        showLoseResult();
    }
}

// 显示胜利结果（在拖拽蒸蚌后调用）
function showWinResult() {
    gameResult.textContent = '🎉 恭喜！小猫获得了3个蒸蚌！';
    gameResult.classList.remove('hidden', 'lose');
    gameResult.classList.add('win');
    
    // 小猫喵喵叫动画
    showMeowAnimation();
    
    // 禁用所有按钮
    instructionTissueBtn.disabled = true;
    instructionCarrotBtn.disabled = true;
}

// 显示失败结果
function showLoseResult() {
    gameResult.textContent = '😿 小猫炸毛了！游戏结束';
    gameResult.classList.remove('hidden', 'win');
    gameResult.classList.add('lose');
    
    // 小猫炸毛动画
    cat.classList.add('angry');
    
    // 禁用所有按钮
    instructionTissueBtn.disabled = true;
    instructionCarrotBtn.disabled = true;
}

// 显示喵喵叫动画
function showMeowAnimation() {
    const meow = document.createElement('div');
    meow.className = 'meow-animation';
    meow.textContent = '🐱 喵喵喵！';
    document.body.appendChild(meow);
    
    setTimeout(() => {
        document.body.removeChild(meow);
    }, 1000);
}

// 更新显示
function updateDisplay() {
    correctCountDisplay.textContent = gameState.correctCount;
    wrongCountDisplay.textContent = gameState.wrongCount;
}

// 这些函数不再需要，因为现在是小猫自动选择

// 重置游戏

// 加载游戏状态（从服务器）
async function loadGameState() {
    if (currentGameId) {
        try {
            const response = await fetch(`${API_BASE_URL}/game/state?gameId=${currentGameId}`);
            if (response.ok) {
                const data = await response.json();
                gameState = data;
                updateDisplay();
            }
        } catch (error) {
            console.error('加载游戏状态错误:', error);
        }
    }
}

