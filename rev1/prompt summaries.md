#Firefox Extension "ChatSaver" Project

ChatSaver will be a Firefox extension that automatically saves responses from predefined URLs to a predefined folder in real-time when they occur. The extension uses the webRequest and downloads APIs to capture and save the responses.

Attached are a list of files and their current contents, followed by a list of outlines and tasks that have not been marked as completed and other relevant information to the desired and current states of the project.

## ChatGPT Action Guidlines:
  A.When generating a response, ChatGPT will follow this outline
  B.Use the Markdown-quoted file-contents I have attached for context, any files existing inside the project are there verbatim (unless otherwise noted)
  C.Output any changes to files-contents necessary, specify begining and ending line numbers where changes begin and end (unless showing whole-file contents)
  D.Title and Output any files-contents needing updates
  E.ChatGPT will be given minified file-contents and output file-contents in the same style of minification
  F.When responding to this message, ChatGPT will first read all available context and then select one or more of the provided "Tasks", that are possible to be resolved in the current context. Changes may be on any number of filecontents but a char maximum of 2500 per response is mandatory.
  G.When writing functions, provide the bodies of only changed functions, I will simply move my copy of their contents to replace the empty {}
  H.Do not provide function bodies for ".summary." files

## Current File Contents

### settings_page.html.summary.json
```json
{"Settings Page": [ "Recording URLs", "File Size Constraints", "File Extension", "Recordings Folder", "Recordings Parsers", "Auto-Delete Settings", "File Browser", "Auto-Save Settings"], "Recording URLs": [ "URL list", "Add URL form"], "Size constraints form": [ "Minimum size input", "Maximum size input"], "Extension form": [ "File extension input"], "Folder form": [ "Folder input", "Change folder button"], "Auto-delete form": [ "Auto-delete checkbox", "Minimum age input"], "Auto-save form": [ "Auto-save checkbox", "Save interval input"], "Parser list": [ "JSON Parser", "XML Parser"], "File Browser": [ "Open file browser button", "Folder label"]}
```
//settings_page.html.summary.json

### settings_page.js.summary.json:
```json
{"Functions": [ "updateFileExtension", "setDefaults", "removeButtonClicked", "updateAutoSaveSettings", "updateURLList", "createUrlListItem", "saveResponse", "updateParserList", "parserEditClicked", "parserRemoveClicked", "updateFolderDisplay", "changeFolderClicked", "initialize", "handleSettingsMessage", "getSettings", "saveSettings", "sendSizeConstraints", "addRecordingURLPattern", "removeRecordingURLPattern", "updateURLPatternList", "toggleAutoDelete"], "Events": [ "onMessage", "onCompleted"], "Imports": [ "getById", "makeE", "putListen", "bMessage", "createNotification", "sanitizeFilename", "getDateTimeCode"], "Constants": [ "addParserButton", "urlList", "changeFolderButton", "autoSaveCheckbox", "saveInterval", "parserList", "addPatternForm", "newPattern", "minSize", "maxSize", "fileExtension", "folder", "urlPatterns", "patternList", "directory", "recordingFolder", "recordingExtension", "sizeConstraints", "autoSaveSettings", "parsers", "responseText", "url", "index", "enabled"], "Callbacks": [ "event", "message", "details"], "Promises": [ "updateRecordingURLList", "downloadUrl"], "WebRequests": [ "urls"]}
```
//settings_page.js.summary.json

### background.js.summary.json:
```json
{"Settings Manager": [ "isRecordingURL", "getFileSizeConstraints", "setFileSizeConstraints", "getRecordingFolderPath", "setRecordingFolderPath", "getRecordingURLs", "setRecordingURLs", "getRecordingExtension", "setRecordingExtension", "getAutoDeleteSettings", "setAutoDeleteSettings", "SaveSettings", "ReloadSettings"], "File Folder Manager": [ "saveResponseToFile", "findOrMakeRecordingsFolder", "deleteSelectedResponses", "setSelectedResponses", "getSelectedResponses", "getOrCreateFile", "deleteOldResponses"], "Parser Manager": [], "init": []}
```
//background.js.summary.json

### file_browser_page.html.summary.json
```json
{"File Browser Page": [ "Directory Tree", "File List", "Delete Selected Button", "Download All Button", "Download Selected Button"], "Directory Tree": [ "Tree List", "Tree List Elements"], "File List": [ "Title", "File List Items"], "Delete Selected Button": [], "Download All Button": [], "Download Selected Button": []}
```
//file_browser_page.html.summary.json

### file_browser_page.js.summary.json
```json
{"Import statements": [ "sanitizeFilename", "getById", "makeE", "bMessage"], "Main function": [ "Retrieve recordingFolder from browser storage", "Retrieve file list and directory tree from DOM", "Create file list with createFileList function", "Create directory tree with createDirectoryTree function", "Add event listener for delete-selected button", "Add event listener for download-all button", "Add event listener for download-selected button"], "createFileList function": [ "Search for files in a given folder path", "Create a list element for each file", "Add a checkbox input for each file", "Add an anchor element for each file", "Add download attribute to anchor element", "Append anchor and checkbox elements to list element", "Clear and replace file list element in the DOM"], "createDirectoryTree function": [ "Search for files in the recording folder", "Group files by directory", "Create a list element for each directory", "Add an anchor element for each directory", "Add onclick listener to each anchor element", "Set 'selected' attribute to root directory anchor element", "Clear and replace directory tree element in the DOM"]}
```
//file_browser_page.js.summary.json

### utils.js.summary.json
```json
{"Utils.js": [ "getById()", "createNotification()", "makeE()", "putListen()", "sanitizeFilename()", "bMessage()"]}
```
//utils.js.summary.json

### Manifest.json.summary.json: 
```json
{"Manifest.json": [ "manifest_version", "name", "version", "description", "permissions", "background", "browser_action", "options_ui", "web_accessible_resources"]}
```
//Manifest.json.summary.json

### icon.svg: 
Not relevant to tasks
//icon.svg

### popup_window.html.summary.json: 
```json
{"ChatSaver Popup Window": [ "Header", "Menu", "Add URL Form", "Notification", "Script"], "Header": ["Title"], "Menu": ["Menu Button", "Menu Content"], "Menu Content": [ "Open Recording Folder Button", "Open Settings Button", "Recorded Responses Label"], "Add URL Form": ["Label", "Input", "Submit Button"], "Notification": [], "Script": []}
```
//popup_window.html.summary.json

### popup_window.js.summary.json: 
```json
{"ChatSaver Popup Window Script": [ "Add URL Form Submit Listener", "Menu Button Listener", "Open Settings Button Listener", "Update URL List", "On Load Event Listener", "Get Saved Responses Count", "Browser Runtime Message Listener"]}
```
//popup_window.js.summary.json

## Project Goals
    Save responses from predefined URLs to a predefined folder in realtime
    Organize saved responses in sub-directories named after their URLs
    Name saved responses after their URL, datetime, original extension, and ".noexec"
    Allow users to investigate saved responses with a file browser UI
    Notify users when a new response has been saved
    Provide an option to automatically delete old responses

## Functionality (across multiple files)
    Create directory trees and file lists
    Save responses to files and delete old responses
    Manage settings, including auto-deletion, auto-saving, file extension, and file size constraints
    Allow users to add and remove recording URLs and update the list of URL patterns
    Provide parsers for specific file types
    Allow users to change the recordings folder and view it in the file browser UI
    Display notifications and handle browser events
    Provide a popup window UI for adding recording URLs and accessing settings and saved responses


## Computing Environment
 Firefox
 Windows

## Tasks
 -Iterate and implement code in/on/for background.js
 -Give code-snippets that user can use to update their files
 -Find inconsistencies or duplications in current code to update, merge duplicates if functionality is missing from one
 -Find missing functions detailed in the outline

## ChatGPT's Turn