let countdown;
let remainingTime = 0;

// 更新显示的时间
function updateDisplay() {
  const hours = Math.floor(remainingTime / 3600);
  const minutes = Math.floor((remainingTime % 3600) / 60);
  const seconds = remainingTime % 60;
  
  document.getElementById('timer').textContent = 
    `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// 开始倒计时
function startTimer(duration) {
  clearInterval(countdown);
  remainingTime = duration * 60; // 转换为秒
  updateDisplay();
  
  countdown = setInterval(() => {
    remainingTime--;
    if (remainingTime < 0) {
      clearInterval(countdown);
      remainingTime = 0;
      updateDisplay();
      return;
    }
    updateDisplay();
  }, 1000);
}

// 当弹出窗口打开时
document.addEventListener('DOMContentLoaded', () => {
  // 从存储中恢复倒计时状态
  chrome.storage.local.get(['endTime'], (result) => {
    if (result.endTime) {
      const now = Date.now();
      if (result.endTime > now) {
        remainingTime = Math.floor((result.endTime - now) / 1000);
        startTimer(remainingTime / 60);
      }
    }
    updateDisplay();
  });

  // 修改开始按钮点击事件处理
  document.getElementById('startTimer').addEventListener('click', () => {
    const hours = parseInt(document.getElementById('hours').value) || 0;
    const minutes = parseInt(document.getElementById('minutes-partial').value) || 0;
    const totalMinutes = hours * 60 + minutes;
    
    if (totalMinutes > 0) {
      const endTime = Date.now() + totalMinutes * 60 * 1000;
      chrome.storage.local.set({ endTime: endTime }, () => {
        window.close();
      });
      startTimer(totalMinutes);
    }
  });

  // 修改重置按钮点击事件处理
  document.getElementById('clearTimer').addEventListener('click', () => {
    clearInterval(countdown);
    remainingTime = 0;
    chrome.storage.local.remove(['endTime'], () => {
      document.getElementById('timer').textContent = '00:00:00';
      document.getElementById('hours').value = '0';
      document.getElementById('minutes-partial').value = '1';
    });
  });
}); 