import { createNotification, sanitizeFilename } from './utils.js';
import './settings_manager';

const Files = [];
const Folders = [];

export const File_Folder_Manager = {
    saveReceivedFile, findOrMakeRecordingsFolder, deleteSelectedResponses, setSelectedResponses, getSelectedResponses, deleteOldResponses
};

async function saveReceivedFile(url, responseHeaders, requestBody, responseData) {
    const datetimeCode = new Date().toISOString().replace(/[:.]/g, "-");
    const extension = responseData.headers["content-type"].split("/")[1];
    const recordingExtension = await Settings_Manager.getRecordingExtension();
    const sanitizedUrl = sanitizeFilename(url);
    const filename = `${sanitizedUrl}-${datetimeCode}.${extension}${recordingExtension}`;
    const dirPath = await getOrCreateDirectory(url);
    const filepath = `${dirPath}/${filename}`;
    const sanitizedResponse = sanitizeFilename(responseData.body);
    const blob = new Blob([sanitizedResponse], { type: responseData.headers["content-type"] });
    const urlObj = URL.createObjectURL(blob);
    try {
        const downloadId = await browser.downloads.download({
            url: urlObj,
            filename: filepath,
            saveAs: false,
        });
        createNotification("ChatSaver", `Response saved: ${filename}`);
    } catch (error) {
        console.error("Error downloading file:", error);
    } finally {
        URL.revokeObjectURL(urlObj);
    }
}

async function findOrMakeRecordingsFolder() {
    const recordingFolder = await Settings_Manager.getRecordingFolder();
    const recordingsFolderExists = await browser.storage.local.get(recordingFolder);
    let recordingsFolderId;
    if (!recordingsFolderExists[recordingFolder]) {
        try {
            const createdFolder = await browser.bookmarks.create({
                title: recordingFolder,
                url: null,
                parentId: "unfiled_bookmarks",
            });
            recordingsFolderId = createdFolder.id;
            await browser.storage.local.set({ [recordingFolder]: recordingsFolderId });
        } catch (error) {
            console.error("Error creating recordings folder:", error);
            throw error;
        }
    } else {
        recordingsFolderId = recordingsFolderExists[recordingFolder];
    }
    return `place:${recordingsFolderId}`;
}

async function deleteSelectedResponses() {
    const selectedResponses = await getSelectedResponses();

    if (selectedResponses.length === 0) {
        return;
    }

    const urls = selectedResponses.map(r => r.url);
    const recordingFolder = await Settings_Manager.getRecordingFolder();

    for (const url of urls) {
        const directoryPath = `${recordingFolder}/${sanitizeFilename(url)}`;
        const contents = await browser.storage.local.get(directoryPath);

        for (const key in contents) {
            if (key !== directoryPath) {
                await browser.storage.local.remove(key);
            }
        }

        await browser.storage.local.remove(directoryPath);
    }
}

function setSelectedResponses(urlList) {
    browser.storage.local.set({ selectedResponses: urlList });
}

function getSelectedResponses() {
    const { selectedResponses = [] } = browser.storage.local.get();

    return selectedResponses;
}

async function getOrCreateDirectory(url) {
    const recordingFolder = await Settings_Manager.getRecordingFolder();
    const sanitizedUrl = sanitizeFilename(url);
    const urlPath = `${recordingFolder}/${sanitizedUrl}`;
    const directoryExists = await browser.storage.local.get(urlPath);

    if (!directoryExists[urlPath]) {
        await browser.storage.local.set({ [urlPath]: true });
    }

    return urlPath;
}
async function deleteOldResponses() {
    const autoDeleteSettings = await Settings_Manager.getAutoDeleteSettings();

    if (autoDeleteSettings.enabled) {
        const recordingsFolder = await Settings_Manager.getRecordingFolder();
        const minAge = autoDeleteSettings.minAge * 24 * 60 * 60 * 1000;
        const recordingsFolderPath = browser.runtime.getURL(recordingsFolder);
        const entries = await browser.storage.local.get();
        const currentTimestamp = new Date().getTime();
        let emptyDirectories = new Set();

        for (const entry in entries) {
            if (entry.startsWith(recordingsFolderPath)) {
                const entryTimestamp = parseInt(entry.split("/").pop().split("-")[0]);

                if (isNaN(entryTimestamp)) {
                    continue;
                }

                if (currentTimestamp - entryTimestamp >= minAge) {
                    await browser.storage.local.remove(entry);

                    const directoryPath = entry.substring(0, entry.lastIndexOf('/'));

                    if (!emptyDirectories.has(directoryPath)) {
                        const directoryContents = Object.keys(entries).filter(e => e.startsWith(directoryPath));

                        if (directoryContents.length === 0) {
                            emptyDirectories.add(directoryPath);
                        }
                    }
                }
            }
        }

        for (const directory of emptyDirectories) {
            await browser.storage.local.remove(directory);
        }
    }
}
