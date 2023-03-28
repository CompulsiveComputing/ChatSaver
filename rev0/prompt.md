# #Firefox Extension "ChatSaver" Project

ChatSaver will be a Firefox extension that automatically saves responses from predefined URLs to a predefined folder in real-time when they occur. The extension uses the webRequest API to capture and save the responses.

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
<!DOCTYPE html><html lang="en"> <head> <meta charset="UTF-8"> <title>ChatSaver</title> <link rel="stylesheet" type="text/css" href="popup.css"> <script src="popup.js"></script> </head> <body> <header> <nav></nav> </header> <main> <p>Recordings saved to: <span id="folderPathText"></span><\/p><button id="toggleButton"> <img src="icons/icon-green-bg.svg" alt="Toggle Recording Button" width="32" height="32"> </button> <section id="notifications"></section> </main> </body></html>
```
//popup.html

### popup.js
```js
/* popup.js */var recording=false;var toggleButton=document.getElementById('toggleButton');var folderPathText=document.getElementById('folderPathText');var notifications=document.getElementById('notifications');/* Set the icon and text based on the recording state */function setIconAndText(){if (recording){toggleButton.style.background='green'; toggleButton.textContent='Recording';}else{toggleButton.style.background='yellow'; toggleButton.textContent='Not Recording';}}/* Set the initial icon and text */setIconAndText();/* Set the folder path text */folderPathText.textContent='ChatSaver';/* Add an event listener to the toggle button */toggleButton.addEventListener('click', function (){/* Toggle the recording state */ recording=!recording; /* Set the icon and text based on the recording state */ setIconAndText(); /* Send a message to the background script to toggle the recording state */ browser.runtime.sendMessage({recording: recording});});/* Display a notification */function showNotification(message){notifications.innerHTML +=message + '<br>';}
```
//popup.js

### popup.css
```css
body{font-family: Arial, sans-serif; font-size: 14px; margin: 8px;}button{background-color: yellow; border: none; color: white; cursor: pointer; font-size: 16px; padding: 8px 16px; text-align: center; text-decoration: none; display: inline-block; margin: 4px 2px; transition-duration: 0.4s;}button:hover{background-color: green;}#folderPath{margin-top: 8px;}
```
//popup.css

### manifest.json
```json
{"manifest_version": 2, "name": "ChatSaver", "version": "1.0", "description": "Automatically saves responses from predefined URLs to a predefined folder in real-time when they occur.", "icons":{"48": "icons/icon.svg", "96": "icons/icon.svg"}, "permissions": [ "webRequest", "webRequestBlocking", "fileSystemProvider", "<all_urls>", "activeTab", "notifications"], "browser_action":{"default_icon":{"19": "icons/icon-gray-bg.svg", "38": "icons/icon-gray-bg.svg"}, "default_title": "ChatSaver", "default_popup": "popup.html"}, "background":{"scripts": [ "background.js"]}, "browser_specific_settings":{"gecko":{"id": "chatsaver@compulsivecomputing.ca", "strict_min_version": "67.0"}}}
```
//manifest.json

### background.js
```js
/* background.js *//* Define the list of predefined URLs */var predefinedUrls=["https://example.com"];/* Define the path to the predefined folder */var predefinedFolder="ChatSaver";/* Define the file system handle */var fileSystemHandle=null;/* Request permission to access the file system */browser.runtime.requestFileSystemProvider(function (){/* Get the file system handle */ browser.runtime.getFileSystemHandle({id: "default", recursive: true},{create: true}, function (handle){fileSystemHandle=handle;});});/* Listen for network requests to predefined URLs */browser.webRequest.onCompleted.addListener(listenerFunction,{urls: [predefinedUrls]});/* Listen for the onClicked event */browser.runtime.onMessage.addListener(function (request, sender, sendResponse){/* Update the recording state */ if (request.recording !==undefined){browser.webRequest.onCompleted.removeListener(listenerFunction); if (request.recording){browser.webRequest.onCompleted.addListener(listenerFunction,{urls: predefinedUrls});}}});browser.runtime.onMessage.addListener(function (request, sender, sendResponse){if (request.getFolderPath){sendResponse({folderPath: predefinedFolder});}});function listenerFunction(details){/* Check if the request was to a predefined URL */ if (predefinedUrls.includes(details.url)){/* Get the current date and time */ var now=new Date(); var dateString=now.toISOString().replace(/[:.]/g, "-"); /* Get the response filename */ var filename=details.url.split("/").pop(); var extension=filename.split(".").pop(); filename=filename.replace("." + extension, "") + "_" + dateString + "." + extension + ".noexec"; /* Get the URL subdirectory */ var subdirectory=details.url.replace(/^https?:\/\//i, "").split("/").join("_"); /* Fetch the response and save it to the predefined folder */ fetch(details.url).then(function (response){return response.blob();}).then(function (blob){var path=predefinedFolder + "/" + subdirectory + "/" + filename; fileSystemHandle.getFile(path,{create: true}).then(function (file){file.createWritable().then(function (writer){writer.write(blob); /* Display notification when the response is saved */ chrome.notifications.create("responseSaved",{type: "basic", iconUrl: "icons/icon.svg", title: "ChatSaver", message: "Response from " + details.url + " saved."});});});});}}

```
//background.js



## Project
### Goals
Save any responses from predefined URLs to a predefined folder in realtime when/if browser contacts said domains 
Organize saved responses in sub-directories named after their URLs
Name saved responses after their URL, datetime, original extension, and ".noexec"
Notify users when a new response has been saved
Has a single UI button that turns green when recording and yellow when not, with a single click toggling between them
Shows the recordings folder-path in the UI

### Functionality
Create directory trees and file lists
Save responses to files
Display notification


## Computing Environment
 Firefox
 Windows

## ChatGPT's Turn