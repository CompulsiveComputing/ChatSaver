const predefinedUrls = ["*://*.openai.com/backend-api/conversation/*"];
const urlFilter = { urls: predefinedUrls };
const browserDBKey = "ChatSaver_Responses";
let recording = true;
initBackground();

function initBackground() {
    console.log("initBackground start");
    browser.runtime.onMessage.addListener(messageListener);
    browser.webRequest.onBeforeRequest.addListener(
        onBeforeRequestListener,
        urlFilter,
        ["blocking"]
    );
    console.log("initBackground end");
}

async function messageListener(request, sender, sendResponse) {
    if (request.notification !== undefined) {
        const notificationsElement = document.getElementById("notifications");
        notificationsElement.innerHTML += "<p>" + request.notification + "</p>";
        notificationsElement.scrollTop = notificationsElement.scrollHeight;
    }
    if (request.action) {
        switch (request.action) {
            case "clearResponses":
                console.log("Clearing saved responses");
                await clearResponses();
                break;
            case "downloadResponses":
                console.log("Downloading saved responses");
                await downloadResponses();
                break;
            case "getResponseCount":
                sendResponse(await getResponseCount());
                break;
            case "setRecordingState":
                console.log("setRecordingState: " + recording + " from " + request.recording);
                recording = request.recording;
                break;
            case "getState":
                sendResponse({
                    responses: await getResponseCount(),
                    recording: recordingn
                });
                break;
            default:
                console.log("Unknown Message: " + request.action);
                break;
        }
    }
    return true;
}

async function onBeforeRequestListener(details) {
    console.log("onBeforeRequestListener", details, recording);
    if (recording) {
        let filter = browser.webRequest.filterResponseData(details.requestId);
        let decoder = new TextDecoder("utf-8");
        let encoder = new TextEncoder();
        let str = "";

        filter.ondata = (event) => {
            str += decoder.decode(event.data, { stream: true });
        };

        filter.onstop = (event) => {
            str += decoder.decode();
            filter.write(encoder.encode(str));
            filter.close();
            saveResponse(details.url, str);
        };

        return {};
    }
}

async function saveResponse(url, responseBody) {
    console.log("saveResponse", url, responseBody);

    const timestamp = new Date().toISOString();
    const domain = new URL(url).hostname;

    const storedResponses = (await browser.storage.local.get(browserDBKey))[browserDBKey] || {};
    if (!storedResponses[domain]) {
        storedResponses[domain] = {};
    }
    storedResponses[domain][timestamp] = responseBody;

    await browser.storage.local.set({ [browserDBKey]: storedResponses });
}



function showNotification(message) {
    browser.notifications.create({
        type: "basic",
        title: "ChatSaver",
        message,
        iconUrl: browser.extension.getURL("icons/icon.png")
    });
}

async function clearResponses() {
    if (confirm("Are you sure you want to clear all saved responses?")) {
        try {
            await browser.storage.local.remove(browserDBKey);
            await updateUI();
            showNotification("All responses cleared.");
        } catch (error) {
            console.error(error);
        }
    }
}

async function download(storedResponses) {
    if (!storedResponses) {
        showNotification("No responses to download.");
        return;
    }

    showNotification("Downloading responses...");

    for (let domain in storedResponses) {
        const files = storedResponses[domain];
        for (let fileName in files) {
            const fileData = files[fileName];
            const blob = new Blob([fileData]);
            const url = URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = fileName+".json";
            a.click();

            URL.revokeObjectURL(url);
        }
    }
}

async function downloadResponses() {
    try {
        const result = await browser.storage.local.get(browserDBKey);
        const storedResponses = result[browserDBKey];
        await download(storedResponses);
    } catch (error) {
        console.error(error);
    }
}

async function getResponseCount() {
    const result = await browser.storage.local.get(browserDBKey);
    const storedResponses = result[browserDBKey];
    if (storedResponses) {
        return Object.values(storedResponses).reduce((acc, curr) => acc + Object.keys(curr).length, 0);
    } else {
        return 0;
    }
}

async function updateUI() {
    await browser.runtime.sendMessage({ action: "updateUI" });
}

async function getStoredResponses() {
    const result = await browser.storage.local.get(browserDBKey);
    return result[browserDBKey] || {};
}
