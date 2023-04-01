# Create a "*.summary.json*" of the following file-contents

## Instructions
 -If writing "*.js", output should contain the variable and function headers, the arguments must be listed and the functions bodies must not be listed
 -If writing "*.html", output should represent only the functional UI elements- the DOM should be transformed int a nested series of arrays representing the elements, with numbered indexes representing any children and named indexes representing properties
 -If writing "*.css", output should represent only the implemented named rules and the bodies must not be listed
 -No summary files should contain any comments.
 -All summary should be formatted as json objects, placed within markdow-quotes, and with extranesous white-space and new-liens removed
 -Only work on the file-contents I have explicitly provided

## File-contents

%% settings_page.html
```html
<!DOCTYPE html><html><head> <meta charset="UTF-8"> <title>ChatSaver Settings</title> <link rel="stylesheet" href="settings.css"></head><body> <h1>ChatSaver Settings</h1> <div id="recording-urls"> <h2>Recording URLs</h2> <ul id="url-list"></ul> <form id="add-url-form"> <label for="new-url">Add URL:</label> <input type="url" id="new-url" required> <input type="submit" value="Add"> </form> <\/div><div id="file-size-constraints"> <h2>File Size Constraints</h2> <form id="size-constraints-form"> <label for="min-size">Minimum size (bytes):</label> <input type="number" id="min-size" min="0" step="1" value="0"> <label for="max-size">Maximum size (bytes):</label> <input type="number" id="max-size" min="0" step="1" value="0"> <input type="submit" value="Update Constraints"> </form> <\/div><div id="file-extension"> <h2>File Extension</h2> <form id="extension-form"> <label for="file-extension">Extension:</label> <input type="text" id="file-extension" value=".txt"> <input type="submit" value="Update Extension"> </form> <\/div><div id="recordings-folder"> <h2>Recordings Folder</h2> <form id="folder-form"> <label for="folder">Folder:</label> <input type="text" id="folder" readonly> <button id="change-folder">Change</button> </form> <\/div><div id="recordings-parsers"> <h2>Recordings Parsers</h2> <ul id="parser-list"></ul> <button id="add-parser-button">Add New Parser</button> <\/div><div id="auto-delete-settings"> <h2>Auto-Delete</h2> <form id="auto-delete-form"> <label for="auto-delete-checkbox">Enable auto-delete:</label> <input type="checkbox" id="auto-delete-checkbox" name="auto-delete-checkbox" checked> <br><label for="min-age">Minimum age (days):</label> <input type="number" id="min-age" min="0" step="1" value="7"> <input type="submit" value="Update Settings"> </form> <\/div><div id="file-browser"> <h2>Recorded Responses Browser</h2> <button id="open-file-browser">Open File Browser</button> <p>Current recordings folder:<\/p><label id="folder-label"></label> <\/div><div id="auto-save-settings"> <h2>Auto-Save</h2> <form id="auto-save-form"> <label for="auto-save-checkbox">Enable auto-save:</label> <input type="checkbox" id="auto-save-checkbox" name="auto-save-checkbox" checked> <br><label for="save-interval">Save interval (seconds):</label> <input type="number" id="save-interval" min="1" step="1" value="10"> <input type="submit" value="Update Settings"> </form> <\/div><script src="settings.js"></script></body></html>
```
%%//settings_page.html

%% settings_page.css: 
```css
body{font-family: Arial, sans-serif; margin: 1em;}h1{font-size: 1.5em; margin-bottom: 1em;}ul{list-style: none; margin: 0; padding: 0;}li{display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5em;}label{display: block; margin-bottom: 0.5em;}input{font-size: 1em; padding: 0.5em; border-radius: 4px; border: 1px solid #ccc;}button{font-size: 1em; padding: 0.5em; border-radius: 4px; border: 1px solid #ccc; cursor: pointer; background-color: #f8f8f8; transition: background-color 0.2s;}button:hover{background-color: #e8e8e8;}input[type="submit"]{width: 100%; margin-top: 1em; background-color: #f8f8f8; border: 1px solid #ccc; border-radius: 4px; font-size: 1em; padding: 0.5em; cursor: pointer; transition: background-color 0.2s;}input[type="submit"]:hover{background-color: #e8e8e8;}
```
%%//settings_page.css

## Begin task