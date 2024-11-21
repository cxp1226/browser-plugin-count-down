let countdown;
let remainingTime = 0;

// 更新显示的时间
function updateDisplay() {
  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;
  document.getElementById('timer').textContent = 
    `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// 开始倒计时
function startTimer(duration) {
  clearInterval(countdown);
  remainingTime = duration * 60;
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

  // 监听开始按钮点击
  document.getElementById('startTimer').addEventListener('click', () => {
    const minutes = parseInt(document.getElementById('minutes').value);
    if (minutes > 0) {
      const endTime = Date.now() + minutes * 60 * 1000;
      chrome.storage.local.set({ endTime: endTime });
      startTimer(minutes);
    }
  });
}); 