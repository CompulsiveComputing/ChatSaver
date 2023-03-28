/* background.js */
/* Define the list of predefined URLs */
var predefinedUrls = ["https://example.com"];
/* Define the path to the predefined folder */
var predefinedFolder = "ChatSaver";
/* Define the file system handle */
var fileSystemHandle = null;
/* Request permission to access the file system */
browser.runtime.requestFileSystemProvider(function () {
    /* Get the file system handle */
    browser.runtime.getFileSystemHandle({ id: "default", recursive: true }, { create: true }, function (handle) { fileSystemHandle = handle; });
});
function downloadListenerFunction(details){
    {
        /* Check if the request was to a predefined URL */
        if (predefinedUrls.includes(details.url)) {
            /* Get the current date and time */
            var now = new Date();
            var dateString = now.toISOString().replace(/[:.]/g, "-");
            /* Get the response filename */
            var filename = details.url.split("/").pop();
            var extension = filename.split(".").pop();
            filename = filename.replace("." + extension, "") + "_" + dateString + "." + extension + ".noexec";
            /* Get the URL subdirectory */
            var subdirectory = details.url.replace(/^https?:\/\//i, "").split("/").join("_");
            /* Fetch the response and save it to the predefined folder */
            fetch(details.url).then(function (response) { return response.blob(); }).then(function (blob) {
                var path = predefinedFolder + "/" + subdirectory + "/" + filename;
                fileSystemHandle.getFile(path, { create: true }).then(function (file) {
                    file.createWritable().then(function (writer) {
                        writer.write(blob);
                        /* Display notification when the response is saved */
                        chrome.notifications.create("responseSaved", { type: "basic", iconUrl: "icons/icon.svg", title: "ChatSaver", message: "Response from " + details.url + " saved." });
                    });
                });
            });
        }
    }
}

/* Listen for network requests to predefined URLs */
browser.webRequest.onCompleted.addListener(downloadListenerFunction, { urls: [predefinedUrls] });

function listenerFunction(details) {
    /* Check if the request was to a predefined URL */
    if (predefinedUrls.includes(details.url)) {
        /* Get the current date and time */
        var now = new Date();
        var dateString = now.toISOString().replace(/[:.]/g, "-");
        /* Get the response filename */
        var filename = details.url.split("/").pop();
        var extension = filename.split(".").pop();
        filename = filename.replace("." + extension, "") + "_" + dateString + "." + extension + ".noexec";
        /* Get the URL subdirectory */
        var subdirectory = details.url.replace(/^https?:\/\//i, "").split("/").join("_");
        /* Fetch the response and save it to the predefined folder */
        fetch(details.url).then(function (response) { return response.blob(); }).then(function (blob) {
            var path = predefinedFolder + "/" + subdirectory + "/" + filename;
            fileSystemHandle.getFile(path, { create: true }).then(function (file) {
                file.createWritable().then(function (writer) {
                    writer.write(blob);
                    /* Display notification when the response is saved */
                    chrome.notifications.create("responseSaved", { type: "basic", iconUrl: "icons/icon.svg", title: "ChatSaver", message: "Response from " + details.url + " saved." });
                });
            });
        });
    }
}

/* Listen for the onClicked event */
browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    /* Update the recording state */
    if (request.recording !== undefined) {
        browser.webRequest.onCompleted.removeListener(listenerFunction);
        if (request.recording) {
            browser.webRequest.onCompleted.addListener(listenerFunction, { urls: predefinedUrls });
        }
    }
});


browser.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.getFolderPath) {
        sendResponse({folderPath: predefinedFolder});
    }
});
