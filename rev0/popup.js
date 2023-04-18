const ui = {
    toggle: { button: null, label: null },
    download: { button: null, label: null },
    clear: { button: null, label: null },
    notifications: { element: null }
};

let recording = true;

document.addEventListener("DOMContentLoaded", init);

async function init() {
    listenForBackgroundMessages();
    bindUI();
    await chrome.runtime.sendMessage({ action: "setRecordingState", recording: recording });
    await updateUI();
}


function listenForBackgroundMessages() {
    chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
        if (request.action === "updateUI") {
            updateUI();
        }
        if (request.action === "responseReceived") {
            await updateButtons();
        }
        return true;
    });

}

function bindToggleUI() {
    ui.toggle.button = document.getElementById("toggleButton");
    ui.toggle.label = document.getElementById("toggleButtonLabel");
    ui.toggle.button.addEventListener("click", toggleClicked);
}

function bindDownloadUI() {
    ui.download.button = document.getElementById("downloadButton");
    ui.download.label = document.getElementById("downloadButtonLabel");
    ui.download.button.addEventListener("click", download);
}

function bindClearUI() {
    ui.clear.button = document.getElementById("clearButton");
    ui.clear.label = document.getElementById("clearButtonLabel");
    ui.clear.button.addEventListener("click", clearClicked);
}

function bindNotificationsUI() {
    ui.notifications.element = document.getElementById("notifications");
}

function bindUI() {
    bindToggleUI();
    bindDownloadUI();
    bindClearUI();
    bindNotificationsUI();
}

async function clearClicked() {
    try {
        await browser.runtime.sendMessage({ action: "clearResponses" });
        await updateUI();
    } catch (error) {
        console.error(error);
    }
}


async function getPopupState() {
    const numResponses = await browser.runtime.sendMessage({ action: "getResponseCount" });

    ui.download.button.disabled = (numResponses === 0);

    updateToggleButton();
}


async function download() {
    await browser.runtime.sendMessage({ action: "downloadResponses" });
}

async function toggleClicked() {
    recording = !recording;
    updateToggleButton();
    await browser.runtime.sendMessage({ action: "setRecordingState", recording: recording });
}

async function updateUI() {
    await updateToggleButton();
    await updateNotifications();
}

function updateToggleButton() {
    ui.toggle.button.classList.toggle("recording", recording);
    if (recording) {
        ui.toggle.button.title = "Stop recording";
        ui.toggle.label.textContent = "Stop Recording";
    } else {
        ui.toggle.button.title = "Start recording";
        ui.toggle.label.textContent = "Start Recording";
    }
}

async function updateNotifications() {
    const responseCount = await browser.runtime.sendMessage({ action: "getResponseCount" });
    const notificationsElement = ui.notifications.element;
    notificationsElement.innerHTML = "";
}