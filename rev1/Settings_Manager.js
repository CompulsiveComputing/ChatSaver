const defaults = {
    recordingFolder: "ChatSaver",
    recordingURLs: ["https://chat.openai.com/backend-api/conversation/"],
    sizeConstraints: { minSize: 0, maxSize: 0 },
    recordingExtension: ".txt",
    autoDeleteSettings: { enabled: false, minAge: 7 }
};

const settings = browser.storage.local.get(defaults);

async function isRecordingURL(url) {
    const recordingURLs = await getRecordingURLs();
    return recordingURLs.some(pattern => new RegExp(pattern).test(url));
}

async function getFileSizeConstraints() {
    const { sizeConstraints } = await browser.storage.local.get('sizeConstraints');
    return sizeConstraints || { minSize: 0, maxSize: Infinity };
}

async function setFileSizeConstraints(minSize, maxSize) {
    await browser.storage.local.set({ sizeConstraints: { minSize, maxSize } });
}

async function getRecordingFolderPath() {
    const { recordingFolder } = await browser.storage.local.get('recordingFolder');
    return recordingFolder || '~/Downloads/ChatSaver';
}

async function setRecordingFolderPath(path) {
    await browser.storage.local.set({ recordingFolder: path });
}

async function getRecordingURLs() {
    const { urlPatterns } = await browser.storage.local.get('urlPatterns');
    return urlPatterns || [];
}

async function setRecordingURLs(urlPatterns) {
    await browser.storage.local.set({ urlPatterns });
}

async function getRecordingExtension() {
    const { recordingExtension } = await browser.storage.local.get('recordingExtension');
    return recordingExtension || '.noexec';
}

async function setRecordingExtension(extension) {
    await browser.storage.local.set({ recordingExtension: extension });
}

async function getAutoDeleteSettings() {
    const { autoDeleteSettings } = await browser.storage.local.get('autoDeleteSettings');
    return autoDeleteSettings || { enabled: false, minAge: 0 };
}

async function setAutoDeleteSettings(enabled, minAge) {
    await browser.storage.local.set({ autoDeleteSettings: { enabled, minAge } });
}

export const Settings_Manager = {
    isRecordingURL,
    getFileSizeConstraints,
    setFileSizeConstraints,
    getRecordingFolderPath,
    setRecordingFolderPath,
    getRecordingURLs,
    setRecordingURLs,
    getRecordingExtension,
    setRecordingExtension,
    getAutoDeleteSettings,
    setAutoDeleteSettings
};
