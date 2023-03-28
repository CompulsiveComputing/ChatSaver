import { getById, makeE, putListen, bMessage, createNotification, sanitizeFilename, getDateTimeCode } from './utils.js';

async function updateFileExtension(extension) {
  await browser.storage.local.set({ recordingExtension: extension });
}

async function setDefaults(storage, defaults) {
  for (const key in defaults) {
    const result = await storage.get(key);
    if (typeof result[key] === 'undefined') {
      const setting = {};
      setting[key] = defaults[key];
      await storage.set(setting);
    }
  }
  const recordingsFolder = defaults.recordingFolder;
  const directory = await browser.downloads.download({
    url: 'data:application/octet-stream,',
    filename: recordingsFolder,
    conflictAction: 'uniquify',
    saveAs: false,
    incognito: false,
    method: 'POST',
  });
  await browser.downloads.erase({ id: directory });
}

function removeButtonClicked(url) {
  bMessage({ action: 'removeRecordingURL', url });
  updateURLList();
}

async function updateAutoSaveSettings(enabled, interval) {
  bMessage({ action: 'updateAutoSaveSettings', enabled: enabled, interval: interval });
  createNotification('Settings Saved', 'Auto-save settings have been updated.');
}

async function updateURLList() {
  bMessage({ action: 'getSizeConstraints' }).then(({ minSize, maxSize }) => {
    getById('min-size').value = minSize;
    getById('max-size').value = maxSize;
  });

  bMessage({ action: 'getRecordingURLs' }).then(async (urls) => {
    const urlList = getById('url-list');
    const { recordingFolder, recordingExtension } = await browser.storage.local.get(['recordingFolder', 'recordingExtension']);

    urlList.innerHTML = '';

    async function downloadUrl(url) {
      const removeButton = makeE('button', {
        textContent: 'Remove',
        listeners: [{
          event: 'click',
          func: () => {
            removeButtonClicked(url);
          }
        }],
      });
      const listItem = makeE('li', {
        textContent: url,
        children: [removeButton]
      });
      urlList.appendChild(listItem);

      const filename = sanitizeFilename(url) + '-' + getDateTimeCode() + recordingExtension;
      const directory = await browser.downloads.download({
        url: url,
        filename: recordingFolder + '/' + sanitizeFilename(url) + '/' + filename,
        conflictAction: 'uniquify',
        saveAs: false,
        incognito: false,
        method: 'GET',
      });
    }

    for (const url of urls) {
      const listItem = createUrlListItem(url);
      urlList.appendChild(listItem);
    }

  });
}

function createUrlListItem(url) {
  const removeButton = makeE('button', {
    textContent: 'Remove',
    listeners: [{ event: 'click', func: () => { removeButtonClicked(url); } }],
  });
  const listItem = makeE('li', { textContent: url, children: [removeButton] });
  return listItem;
}

async function saveResponse(url, responseText) {
  const { recordingFolder, recordingExtension } = await browser.storage.local.get(['recordingFolder', 'recordingExtension']);
  const filename = sanitizeFilename(url) + '-' + getDateTimeCode() + recordingExtension;
  const blob = new Blob([responseText], { type: 'text/plain' });
  const blobURL = URL.createObjectURL(blob);

  await browser.downloads.download({
    url: blobURL,
    filename: recordingFolder + '/' + sanitizeFilename(url) + '/' + filename,
    conflictAction: 'uniquify',
    saveAs: false,
    incognito: false,
  });

  URL.revokeObjectURL(blobURL);
}

async function updateParserList() {
  const parsers = await browser.storage.local.get('parsers');
  const parserList = getById('parser-list');
  parserList.innerHTML = '';

  for (const parser of parsers.parsers) {
    const editButton = makeE('button', {
      textContent: 'Edit',
      listeners: [{
        event: 'click',
        func: () => parserEditClicked(parser)
      }],
    });
    const removeButton = makeE('button', {
      textContent: 'Remove',
      listeners: [{
        event: 'click',
        func: () => parserRemoveClicked(parser)
      }],
    });
    const listItem = makeE('li', {
      textContent: parser.name,
      children: [editButton, removeButton]
    });
    parserList.appendChild(listItem);
  }
}

async function parserEditClicked(parser) {
  const newParser = prompt('Enter new parser code:', parser.parser);
  if (newParser) {
    parser.parser = newParser;
    await browser.storage.local.set({ parsers });
    updateParserList();
    saveSettings();
    createNotification('Settings Saved', 'Parser has been edited.');
  }
}

async function parserRemoveClicked(parser) {
  const index = parsers.parsers.indexOf(parser);
  parsers.parsers.splice(index, 1);
  await browser.storage.local.set({ parsers });
  updateParserList();
  saveSettings();
  createNotification('Settings Saved', 'Parser has been removed.');
}

async function updateFolderDisplay() {
  const { recordingFolder } = await browser.storage.local.get('recordingFolder');
  getById('folder').value = recordingFolder;
}

async function changeFolderClicked() {
  const folder = await browser.runtime.sendMessage({ action: 'selectFolder' });
  if (folder) {
    await browser.storage.local.set({ recordingFolder: folder });
    updateFolderDisplay();
    createNotification('Settings Saved', 'Recordings folder has been updated.');
  }
}

function initialize() {
  const addParserButton = getById('add-parser-button');
  addParserButton.addEventListener('click', async () => {
    const name = prompt('Enter parser name:');
    const parser = prompt('Enter parser code:');
    if (name && parser) {
      const parsers = await browser.storage.local.get('parsers');
      parsers.parsers.push({ name, parser });
      await browser.storage.local.set({ parsers });
      updateParserList();
      saveSettings();
    }
  });
  putListen(getById('auto-save-form'), 'submit', (event) => {
    event.preventDefault();
    const autoSaveCheckbox = getById('auto-save-checkbox');
    const saveInterval = getById('save-interval').value;
    updateAutoSaveSettings(autoSaveCheckbox.checked, saveInterval);
  });
  putListen(getById('add-pattern-form'), 'submit', async (event) => {
    event.preventDefault();
    const newPattern = getById('new-pattern').value;
    addRecordingURLPattern(newPattern);
    getById('new-pattern').value = '';
  });
  const changeFolderButton = getById('change-folder');
  changeFolderButton.addEventListener('click', async () => {
    await changeFolderClicked();
  });
  putListen(getById('extension-form'), 'submit', (event) => {
    event.preventDefault();
    const fileExtension = getById('file-extension').value;
    updateFileExtension(fileExtension);
  });
  putListen(getById('auto-delete-toggle'), 'change', async (event) => {
    await toggleAutoDelete(event.target.checked);
  });

  saveSettings();
}


initialize();

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'getRecordingFolder') {
    const { recordingFolder } = await browser.storage.local.get('recordingFolder');
    return recordingFolder;
  }
});

async function handleSettingsMessage(message, storage) {
  switch (message.action) {
    case 'updateSizeConstraints':
      const sizeConstraints = {
        minSize: parseInt(message.minSize),
        maxSize: parseInt(message.maxSize),
      };
      await storage.set({ sizeConstraints });
      return sizeConstraints;
    case 'updateAutoSaveSettings':
      const autoSaveSettings = {
        enabled: message.enabled,
        interval: parseInt(message.interval),
      };
      await storage.set({ autoSaveSettings });
      if (autoSaveSettings.enabled) {
        const saveInterval = autoSaveSettings.interval * 60 * 1000;
        setInterval(() => {
          bMessage({ action: 'saveRecordings' });
        }, saveInterval);
      }
      return autoSaveSettings;
    default:
      return null;
  }
}

async function getSettings() {
  const {
    recordingFolder,
    recordingExtension,
    sizeConstraints
  } = await browser.storage.local.get([
    'recordingFolder',
    'recordingExtension',
    'sizeConstraints'
  ]);
  return {
    recordingFolder,
    recordingExtension,
    sizeConstraints
  };
}

async function saveSettings() {
  const {
    recordingFolder,
    recordingExtension,
    sizeConstraints
  } = await getSettings();

  getById('min-size').value = sizeConstraints.minSize;
  getById('max-size').value = sizeConstraints.maxSize;
  getById('file-extension').value = recordingExtension;
  getById('folder').value = recordingFolder;

  updateURLList();
  updateParserList();
}

async function sendSizeConstraints() {
  const minSize = parseInt(getById('min-size').value);
  const maxSize = parseInt(getById('max-size').value);
  bMessage({ action: 'updateSizeConstraints', minSize, maxSize });
}

async function addRecordingURLPattern(pattern) {
  const { urlPatterns } = await browser.storage.local.get('urlPatterns');
  urlPatterns.push(pattern);
  await browser.storage.local.set({ urlPatterns });
  updateURLPatternList();
}

async function removeRecordingURLPattern(pattern) {
  const { urlPatterns } = await browser.storage.local.get('urlPatterns');
  const index = urlPatterns.indexOf(pattern);
  if (index > -1) {
    urlPatterns.splice(index, 1);
    await browser.storage.local.set({ urlPatterns });
  }
  updateURLPatternList();
}

async function updateURLPatternList() {
  const { urlPatterns } = await browser.storage.local.get('urlPatterns');
  const patternList = getById('pattern-list');
  patternList.innerHTML = '';

  for (const pattern of urlPatterns) {
    const removeButton = makeE('button', {
      textContent: 'Remove',
      listeners: [{ event: 'click', func: () => removeRecordingURLPattern(pattern) }],
    });

    const listItem = makeE('li', {
      textContent: pattern,
      children: [removeButton],
    });

    patternList.appendChild(listItem);
  }
}

browser.webRequest.onCompleted.addListener(
  async (details) => {
    if (details.method === 'GET') {
      const urls = await browser.storage.local.get('recordingURLs');
      for (const url of urls.recordingURLs) {
        if (details.url.startsWith(url)) {
          const responseText = await (await fetch(details.url)).text();
          saveResponse(url, responseText);
          break;
        }
      }
    }
  },
  { urls: ['<all_urls>'] }
);

async function toggleAutoDelete(enabled) {
  await browser.storage.local.set({ autoDelete: enabled });
  createNotification('Settings Saved', 'Auto-delete setting has been updated.');
}
