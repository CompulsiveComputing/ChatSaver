import { File_Folder_Manager } from '/File_Folder_Manager.js';
import { Settings_Manager } from './Settings_Manager.js';
import { Parser_Manager } from '/Parser_Manager.js';
import { sanitizeFilename, getById, createNotification, bMessage, makeE, putListen } from '/utils.js';

async function init() {
  await Settings_Manager.ReloadSettings();

  const recordingURLs = await Settings_Manager.getRecordingURLs();

  browser.webRequest.onCompleted.addListener(
    async ({ url, statusCode, responseHeaders, requestBody, responseData }) => {
      if (statusCode === 200 && await Settings_Manager.isRecordingURL(url)) {
        await File_Folder_Manager.saveReceivedFile(url, responseHeaders, requestBody, responseData);
      }
    },
    { urls: recordingURLs },
    ["responseHeaders"]
  );

  browser.runtime.onMessage.addListener(async message => {
    switch (message.action) {
      case "addRecordingURL":
        await Settings_Manager.setRecordingURLs([...message.urls]);
        break;
      case "removeRecordingURL":
        await Settings_Manager.setRecordingURLs(message.urls.filter(url => url !== message.urlToRemove));
        break;
      case "getRecordingURLs":
        return await Settings_Manager.getRecordingURLs();
      case "selectFolder":
        await Settings_Manager.setRecordingFolderPath(message.folderPath);
        break;
      case "updateSizeConstraints":
        await Settings_Manager.setFileSizeConstraints(message.minSize, message.maxSize);
        break;
      case "updateRecordingExtension":
        await Settings_Manager.setRecordingExtension(message.extension);
        break;
      case "updateRecordingFolder":
        await Settings_Manager.setRecordingFolderPath(message.folderPath);
        break;
      case "toggleAutoDelete":
        const autoDeleteSettings = await Settings_Manager.getAutoDeleteSettings();
        await Settings_Manager.setAutoDeleteSettings(!autoDeleteSettings.enabled, autoDeleteSettings.minAge);
        break;
      case "updateAutoDeleteSettings":
        await Settings_Manager.setAutoDeleteSettings(message.enabled, message.minAge);
        break;
      case "getAutoDeleteSettings":
        return await Settings_Manager.getAutoDeleteSettings();
      default:
        break;
    }
  });
}

init();
