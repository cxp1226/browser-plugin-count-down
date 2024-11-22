let countdown;

// 更新图标上显示的时间
function updateBadgeText(timeString) {
  chrome.action.setBadgeText({ text: timeString });
  chrome.action.setBadgeTextColor({ color: '#FFFFFF' });  // 设置文字颜色为白色
  chrome.action.setBadgeBackgroundColor({ color: '#2196F3' });  // 设置背景色为蓝色
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
        updateBadgeText(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      } else {
        updateBadgeText('');
        chrome.storage.local.remove(['endTime']);
        // 时间到时显示通知
        showNotification();
      }
    } else {
      updateBadgeText('');
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