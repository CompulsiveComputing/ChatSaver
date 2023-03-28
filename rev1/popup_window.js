import { getById, bMessage} from './utils.js';

function openFolder() {
  bMessage({ action: 'openFolder' });
}

function openSettings() {
  browser.runtime.openOptionsPage();
}

document.addEventListener('DOMContentLoaded', () => {
  updateURLList();
});

browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'showNotification') {
    const notification = getById('notification');
    notification.textContent = message.text;
    notification.classList.add('show');
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
});
