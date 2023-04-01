# Create a "*.summary.json" of the following file-contents

## Instructions
Create a markdown-quoted area and place within it a "*.summary.json" of the following file-contents
 -If writing "*.html", 
   -minify as much as possible
   -the DOM should be transformed into a nested series of arrays&elements representing the elements, 
      -elements should be made arrays
         -first element should be the element tag
         -second element should be an object representing any attributes/properties of the element or be empty {}
         -all further elements should be the children of those elements in the DOM
 -If writing "*.css", output should represent only the implemented named rules and the bodies must not be listed
No summary files should contain any comments.
All summary should be 
   -formatted as json objects, 
   -placed within markdow-quotes, 
Do not include extraneous white-space and new-lines / carriage-returns / indentation
Only work on the file-contents I have explicitly provided
Reminder to not include white-space where not necessary, this is to save on character count

## ChatGPT Action Guidlines:
  A.When generating a response, ChatGPT will follow this outline
  B.Use the Markdown-quoted file-contents I have attached for context, any files existing inside the project are there verbatim (unless otherwise noted)
  C.Output any changes to files-contents necessary, specify begining and ending line numbers where changes begin and end (unless showing whole-file contents)
  D.Title and Output any files-contents needing updates
  E.ChatGPT will be given minified file-contents and output file-contents in the same style of minification
  F.When responding to this message, ChatGPT will first read all available context and then select one or more of the provided "Tasks", that are possible to be resolved in the current context. Changes may be on any number of filecontents but a char maximum of 2500 per response is mandatory.
  G.When writing functions, provide the bodies of only changed functions, I will simply move my copy of their contents to replace the empty {}
  H.Do not provide function bodies for ".summary." files


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

## Demonstration

%% Partial settings_page.html.summary.json
```
{"settings_page.html": [ "html", [ [ "head", [ ["meta",{"charset": "UTF-8"}], ["title", "ChatSaver Settings"], ["link",{"rel": "stylesheet", "href": "settings.css"}]]], [ "body", [ ["h1", "ChatSaver Settings"], [ "div",{"id": "recording-urls"}, [ ["h2", "Recording URLs"], ["ul",{"id": "url-list"}], [ "form",{"id": "add-url-form"}, [ ["label",{"for": "new-url"}, "Add URL:"], ["input",{"type": "url", "id": "new-url", "required": ""}], ["input",{"type": "submit", "value": "Add"}]]]]], [ "div",{"id": "file-size-constraints"}, [ ["h2", "File Size Constraints"], [ "form",{"id": "size-constraints-form"}, [ ["label",{"for": "min-size"}, "Minimum size (bytes):"], ["input",{"type": "number", "id": "min-size", "min": "0", "step": "1", "value": "0"}], ["label",{"for": "max-size"}, "Maximum size (bytes):"], ["input",{"type": "number", "id": "max-size", "min": "0", "step": "1", "value": "0"}], ["input",{"type": "submit", "value": "Update Constraints"}]]]]], [ "div",{"id": "file-extension"}, [ ["h2", "File Extension"], [ "form",{"id": "extension-form"}, [ ["label",{"for": "file-extension"}, "Extension:"], ["input",{"type": "text", "id": "file-extension", "value": ".txt"}], ["input",{"type": "submit", "value": "Update Extension"}]]]]], [ "div",{"id": "recordings-folder"}, [ ["h2", "Recordings Folder"], [ "form",{"id": "folder-form"}, [ ["label",{"for": "folder"}, "Folder:"], ["input",{"type": "text", "id": "folder", "readonly": ""}], ["button",{"id": "change-folder"}, "Change"]]]]], [ "div",{"id": "recordings-parsers"}, [ ["h2", "Recordings Parsers"], ["ul",{"id": "parser-list"}], ["button",{"id": "add-parser-button"}, "Add New Parser"]]], [ "div",{"id": "auto-delete-settings"}, [ ["h2", "Auto-Delete"], [ "form",{"id": "auto-delete-form"}, [ ["label",{"for": "auto-delete-checkbox"}, "Enable auto-delete:"
```
%%// Partial settings_page.html.summary.json

## Begin task