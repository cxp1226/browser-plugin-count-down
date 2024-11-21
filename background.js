let countdown;

// 更新图标上的倒计时文字
function updateBadge(minutes, seconds) {
  const text = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  chrome.action.setBadgeText({ text: minutes > 0 || seconds > 0 ? text : '' });
  chrome.action.setBadgeBackgroundColor({ color: '#4688F1' });
}

// 显示通知
function showNotification() {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'fluent-emoji-flat--alarm-clock.png',
    title: '叮叮叮叮叮',
    message: '叮叮叮叮叮叮叮叮！',
    priority: 2
  });
}

// 检查并更新倒计时
function checkAndUpdateTimer() {
  chrome.storage.local.get(['endTime'], (result) => {
    if (result.endTime) {
      const now = Date.now();
      if (result.endTime > now) {
        const remainingSeconds = Math.floor((result.endTime - now) / 1000);
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;
        updateBadge(minutes, seconds);
      } else {
        updateBadge(0, 0);
        chrome.storage.local.remove(['endTime']);
        // 时间到时显示通知
        showNotification();
      }
    }
  });
}

// 每秒更新一次
chrome.alarms.create('updateTimer', { periodInMinutes: 1/60 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'updateTimer') {
    checkAndUpdateTimer();
  }
});

// 初始检查
checkAndUpdateTimer(); 