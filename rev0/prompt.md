# #Firefox Extension "ChatSaver" Project

ChatSaver will be a Firefox extension that automatically saves responses from predefined URLs to browser storage in real-time when they occur. The extension uses the webRequest API to capture and save the responses.

Files will be saved to browser storage until a button is pressed in the UI to dump them into the default downloads folder and *then* clear the stored.

Attached are a list of any existing files and their current contents, followed by a list of outlines and tasks that have not been marked as completed and/or other relevant information to the desired and current states of the project.

## ChatGPT Action Guidlines:
  A.When generating a response, ChatGPT will follow this outline
  B.Use the Markdown-quoted file-contents I have attached for context, any files existing inside the project are there verbatim (unless otherwise noted)
  C.Output any changes to files-contents necessary, specify begining and ending line numbers where changes begin and end (unless showing whole-file contents)
  D.Title and Output any files-contents needing updates
  E.ChatGPT will be given minified file-contents and output file-contents in the same style of minification
  F.When responding to this message, ChatGPT will first read all available context and then select one or more of the provided "Tasks", that are possible to be resolved in the current context. Changes may be on any number of filecontents but a char maximum of 2500 per response is mandatory.
  G.When writing functions, provide the bodies of only changed functions, I will simply move my copy of their contents to replace the empty {}
  H.Do not provide function bodies for ".summary." files
  I.Use only "/*" + "*/" styled comments in javascript. Alter any existing comments to match.

## Current File Contents

### popup.html
```html
<!DOCTYPE html><html lang="en"><head> <meta charset="UTF-8"> <title>ChatSaver</title> <link rel="stylesheet" type="text/css" href="popup.css"></head><body> <main> <button id="toggleButton" aria-label="Toggle Recording" class="button"> <img src="icons/icon-gray-bg.svg" alt="Toggle Recording Button" width="32" height="32"> <span id="toggleButtonLabel">Start Recording</span> </button> <button id="downloadButton" class="button download">Download</button> <button id="clearButton" class="button clear">Clear</button> <section id="notifications"></section> </main> <script src="popup.js"></script></body></html>
```
//popup.html


### popup.css
```css
body{font-family: Arial, sans-serif; font-size: 16px; color: #222; background-color: #9c9c9c;}button{background-color: #007bff; border: none; cursor: pointer; margin-right: 10px; padding: 12px 20px; border-radius: 5px; color: #fff; font-size: 16px; font-weight: bold;}button:hover{background-color: #0056b3;}button:disabled{opacity: 0.5; cursor: default;}#toggleButton{background-color: #dc3545;}#toggleButton.recording{background-color: #28a745;}#downloadButton{background-color: #fff;}#downloadButton:not(:disabled):hover{background-color: #444;}#clearButton{background-color: #ddd; color: #222;}#clearButton:not(:disabled):hover{background-color: #bbb;}.download{margin-left: auto;}#notifications{margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px;}.notification{margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 5px;}.notification .title{font-weight: bold; margin-bottom: 5px;}.notification .date{color: #aaa; font-size: 12px;}
```
//popup.css

### popup.js
```js
const ui={toggle:{button: null, label: null}, download:{button: null, label: null}, clear:{button: null, label: null}, notifications:{element: null}};let recording=true;document.addEventListener("DOMContentLoaded", init);function init(){bindUI(); updateButtons(); listenForBackgroundMessages();}function listenForBackgroundMessages(){browser.runtime.onMessage.addListener(async function (request, sender, sendResponse){if (request.action==="updateUI"){updateUI();}if (request.action==="responseReceived"){await updateButtons();}return true;});}function bindToggleUI(){ui.toggle.button=document.getElementById("toggleButton"); ui.toggle.label=document.getElementById("toggleButtonLabel"); ui.toggle.button.addEventListener("click", toggleClicked);}function bindDownloadUI(){ui.download.button=document.getElementById("downloadButton"); ui.download.label=document.getElementById("downloadButtonLabel"); ui.download.button.addEventListener("click", download);}function bindClearUI(){ui.clear.button=document.getElementById("clearButton"); ui.clear.label=document.getElementById("clearButtonLabel"); ui.clear.button.addEventListener("click", clearClicked);}function bindNotificationsUI(){ui.notifications.element=document.getElementById("notifications");}function bindUI(){bindToggleUI(); bindDownloadUI(); bindClearUI(); bindNotificationsUI();}async function clearClicked(){try{await browser.runtime.sendMessage({action: "clearResponses"}); await updateUI();}catch (error){console.error(error);}}async function getPopupState(){const responses=await browser.runtime.sendMessage({action: "getResponseCount"}); if (responses){ui.download.button.disabled=(responses===0);}else{ui.download.button.disabled=true;}updateToggleButton();}async function download(){await browser.runtime.sendMessage({action: "downloadResponses"});}async function toggleClicked(){recording=!recording; await browser.runtime.sendMessage({action: "setRecordingState", recording: recording});}function updateToggleButton(){ui.toggle.button.classList.toggle("recording", recording); if (recording){ui.toggle.button.style.backgroundColor="green"; ui.toggle.button.title="Stop recording"; ui.toggle.label.textContent="Stop Recording";}else{ui.toggle.button.style.backgroundColor="yellow"; ui.toggle.button.title="Start recording"; ui.toggle.label.textContent="Start Recording";}}async function updateButtons(){const{responses: storedResponses, recording: currentRecording}=await browser.runtime.sendMessage({action: "getState"}); if (storedResponses){const numResponses=Object.values(storedResponses).reduce((acc, curr)=> acc + Object.keys(curr).length, 0); ui.download.button.disabled=(numResponses===0);}else{ui.download.button.disabled=true;}recording=currentRecording; updateToggleButton();}
```
//popup.js

### background.js
```js
const predefinedUrls=["https://chat.openai.com/backend-api/conversation/*"];const urlFilter={urls: predefinedUrls};const browserDBKey="ChatSaver_Responses";let recording=true;initBackground();function initBackground(){console.log("initBackground start"); browser.runtime.onMessage.addListener(messageListener); browser.webRequest.onBeforeRequest.addListener(onBeforeRequestListener, urlFilter, ['blocking']); browser.webRequest.onResponseStarted.addListener(onResponseStartedListener, urlFilter, ['responseHeaders']); console.log("initBackground end");}async function messageListener(request, sender, sendResponse){if (request.notification !==undefined){const notificationsElement=document.getElementById("notifications"); notificationsElement.innerHTML +="<p>" + request.notification + "</p>"; notificationsElement.scrollTop=notificationsElement.scrollHeight;}if (request.action){switch (request.action){case "clearResponses": console.log("Clearing saved responses"); await clearResponses(); break; case "downloadResponses": console.log("Downloading saved responses"); await downloadResponses(); break; case "getResponseCount": sendResponse(await getResponseCount()); break; case "setRecordingState": console.log("setRecordingState: " + recording + " from " + request.recording); recording=request.recording; break; case "getState": sendResponse({responses: await getResponseCount(), recording: recordingn}); break; default: console.log("Unknown Message: " + request.action); break;}}return true;}async function onBeforeRequestListener(details){console.log("onBeforeRequestListener", details, recording); if (recording){let filter=browser.webRequest.filterResponseData(details.requestId); let decoder=new TextDecoder("utf-8"); let encoder=new TextEncoder(); let str=''; filter.ondata=event=>{str +=decoder.decode(event.data,{stream: true});}; filter.onstop=event=>{filter.write(encoder.encode(str)); filter.close(); details.responseBody=str;}return{};}}async function onResponseStartedListener(details){console.log("onResponseStartedListener", details, recording); if (recording){/* wait for response to complete, then save*/ saveResponse(details.url, details.responseBody);}}async function getResponseBody(tabId){console.log("getResponseBody", tabId); return;}async function saveResponse(url, responseBody){console.log("saveResponse", url, responseBody); const timestamp=new Date().toISOString(); const domain=new URL(url).hostname; const storedResponses=(await browser.storage.local.get(browserDBKey))[browserDBKey] ||{}; if (!storedResponses[domain]){storedResponses[domain]={};}storedResponses[domain][timestamp]=responseBody; await browser.storage.local.set({[browserDBKey]: storedResponses});}function showNotification(message){browser.notifications.create({type: "basic", title: "ChatSaver", message, iconUrl: browser.extension.getURL("icons/icon.png")});}async function clearResponses(){if (confirm("Are you sure you want to clear all saved responses?")){try{await browser.storage.local.remove(browserDBKey); await updateUI(); showNotification("All responses cleared.");}catch (error){console.error(error);}}}async function download(storedResponses){if (!storedResponses){showNotification("No responses to download."); return;}showNotification("Downloading responses..."); for (let folderName in storedResponses){const folderData=storedResponses[folderName]; for (let fileName in folderData){const fileData=folderData[fileName]; const blob=new Blob([fileData.responseBody]); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=fileName; a.click(); URL.revokeObjectURL(url);}}}async function downloadResponses(){try{const result=await browser.storage.local.get(browserDBKey); const storedResponses=result[browserDBKey]; await download(storedResponses);}catch (error){console.error(error);}}async function getResponseCount(){const result=await browser.storage.local.get(browserDBKey); const storedResponses=result[browserDBKey]; if (storedResponses){return Object.values(storedResponses).reduce((acc, curr)=> acc + Object.keys(curr).length, 0);}else{return 0;}}async function updateUI(){await browser.runtime.sendMessage({action: "updateUI"});}async function getStoredResponses(){const result=await browser.storage.local.get(browserDBKey); return result[browserDBKey] ||{};}
```
//background.js

### manifest.json
```json
{"manifest_version": 2, "name": "ChatSaver", "version": "1.0", "description": "", "icons":{"48": "icons/icon.svg", "96": "icons/icon.svg"}, "permissions": [ "webRequest", "webRequestBlocking", "storage", "<all_urls>", "activeTab", "notifications"], "browser_action":{"default_icon":{"19": "icons/icon.svg", "38": "icons/icon.svg"}, "default_title": "ChatSaver", "default_popup": "popup.html"}, "background":{"scripts": [ "background.js"]}, "content_security_policy": "script-src 'self' 'unsafe-eval'; object-src 'self'", "browser_specific_settings":{"gecko":{"id": "chatsaver@compulsivecomputing.ca", "strict_min_version": "67.0"}}}
```
//manifest.json


## Tasks
 -make it work

## Known problems:
 -only the init colsole logs fire
 -onBeforeRequestListener never fires
 -onResponseStartedListener never fires
 -getResponseBody never fires and may not be needed?
 -saveResponse never fires

## ChatGPT's Turn