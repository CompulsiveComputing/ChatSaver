export { sanitizeFilename, getById, createNotification, bMessage, makeE, putListen };

function getById(id) { return document.getElementById(id); }

function createNotification(title, message) {
    browser.notifications.create({ type: 'basic', iconUrl: browser.extension.getURL('icon.svg'), title: title, message: message, });
}
function makeE(type) { return document.createElement(type); } function putListen(element, listener) {
    return element.addEventListener(listener);
}
function sanitizeFilename(filename) {
    return filename.replace(/[^a-z0-9_\-.]/gi, '_');
}
function bMessage(message) {
    return browser.runtime.sendMessage(message);
}

