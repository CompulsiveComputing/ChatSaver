# Finish an html+css+JS script that can take an HTML file in the form of a user-input string and produce an output conforming to task 1. Create a textarea for user to input the file-string and another to contain the generated output.

File-contents and partial demo of the rules are included

## Task
1. {
Create a markdown-quoted area and place within it a "*.summary.json" of the following file-contents
 -If writing html, 
   -minify as much as possible
   -the DOM should be transformed into a nested series of arrays&elements representing the elements, 
      -elements should be made arrays
         -first element should be the element tag
         -second element should be an object representing any attributes/properties of the element or be empty {}
         -all further elements should be the children of those elements in the DOM
 -If writing css, output should represent only the implemented selectors, the bodies must not be listed
 -If writing JS, the variable names should be preserved as well as function headers and arguments, but no function bodies should be contained
No summary files should contain any comments.
All summary should be 
   -formatted as json objects, 
   -placed within markdow-quotes, 
Do not include white-space / new-lines / carriage-returns / indentation / "\n" / "/n" / spaces / tabs
Only work on the file-contents I have explicitly provided
Reminder to place all file-contents for each respective file on their own line
}

## ChatGPT Action Guidlines:
  A.When generating a response, ChatGPT will follow this outline
  B.Use the Markdown-quoted file-contents I have attached for context, any files existing inside the project are there verbatim (unless otherwise noted)
  C.Output any changes to files-contents necessary, specify begining and ending line numbers where changes begin and end (unless showing whole-file contents)
  D.Title and Output any files-contents needing updates
  E.ChatGPT will be given minified file-contents and output file-contents in the same style of minification
  F.When responding to this message, ChatGPT will first read all available context and then select one or more of the provided "Tasks", that are possible to be resolved in the current context. Changes may be on any number of filecontents but a char maximum of 2500 per response is mandatory.
  G.When writing functions, provide the bodies of only changed functions, I will simply move my copy of their contents to replace the empty {}


## Partial implementation

%% summary.html
```html
<!DOCTYPE html><html> <head> <meta charset="UTF-8"> <title>File Summary Generator</title> <link rel="stylesheet" href="summary.css"> <script src="summary.js" defer></script> </head> <body> <h1>File Summary Generator</h1> <div class="container"> <div class="radio-buttons"> <label><input type="radio" name="file-type" value="html" checked>HTML</label> <label><input type="radio" name="file-type" value="css">CSS</label> <label><input type="radio" name="file-type" value="js">JavaScript</label> </div><div class="textareas"> <textarea class="input" id="file-input" placeholder="Paste file contents here"></textarea> <textarea class="output" id="file-summary" placeholder="Summary output will appear here" readonly></textarea> </div><button id="generate-summary" onclick="generateFileSummary()">Generate Summary</button></div></body></html>
```
%%// summary.html

%% summary.js
```js
function getNestedElements(htmlString){const parser=new DOMParser(); const domTree=parser.parseFromString(htmlString, "text/html"); return domNodeToNestedArray(domTree.documentElement); function domNodeToNestedArray(node){if (!node){return [];}if (node.nodeType===Node.TEXT_NODE){return node.nodeValue.trim();}const tagName=node.tagName.toLowerCase(); const attributes=getAttributes(node); const children=Array.from(node.childNodes).map(domNodeToNestedArray); return [tagName, attributes, ...children];}function getAttributes(node){const attributes={}; for (const attr of node.attributes){attributes[attr.name]=attr.value;}return attributes;}}function generateFileSummary(){const inputTextarea=document.getElementById("file-input"); const outputTextarea=document.getElementById("file-summary"); const fileType=document.querySelector('input[name="file-type"]:checked').value; let fileSummary=""; if (fileType==="html"){const htmlString=inputTextarea.value; const nestedArray=getNestedElements(htmlString); fileSummary=JSON.stringify(nestedArray);}else if (fileType==="css"){/* ... Implement CSS summary logic here*/}else if (fileType==="js"){/* ... Implement JS summary logic here*/}outputTextarea.value=fileSummary;}function generateSummary(inputHTML){const parser=new DOMParser(); const domTree=parser.parseFromString(inputHTML, "text/html"); const nestedArray=domNodeToNestedArray(domTree.documentElement); const output={"html": JSON.stringify(nestedArray), "css": getSelectors(inputHTML), "js": getFunctionNames(summaryJS),}; return "```\n" + JSON.stringify(output, null, "") + "\n```";}function domNodeToNestedArray(node){if (!node){return [];}if (node.nodeType===Node.TEXT_NODE){return node.nodeValue.trim();}const tagName=node.tagName.toLowerCase(); const attributes=getAttributes(node); const children=Array.from(node.childNodes).map(domNodeToNestedArray); return [tagName, attributes, ...children];}function getAttributes(node){const attributes={}; for (const attr of node.attributes){attributes[attr.name]=attr.value;}return attributes;}function getSelectors(htmlString){const cssSelectors=new Set(); const regex=/(?<=class=")(.*?)(?=")/g; let match; while ((match=regex.exec(htmlString))){const selectors=match[1].split(" "); selectors.forEach((selector)=> cssSelectors.add(selector));}return JSON.stringify([...cssSelectors]);}function getFunctionNames(jsString){const functionNames=[]; const regex=/function\s+(\w+)/g; let match; while ((match=regex.exec(jsString))){functionNames.push(match[1]);}return JSON.stringify(functionNames);}function getNestedElements(htmlString){const parser=new DOMParser(); const domTree=parser.parseFromString(htmlString, "text/html"); return domNodeToNestedArray(domTree.documentElement); function domNodeToNestedArray(node){if (!node){return [];}if (node.nodeType===Node.TEXT_NODE){return node.nodeValue.trim();}const tagName=node.tagName.toLowerCase(); const attributes=getAttributes(node); const children=Array.from(node.childNodes).map(domNodeToNestedArray); return [tagName, attributes, ...children];}function getAttributes(node){const attributes={}; for (const attr of node.attributes){attributes[attr.name]=attr.value;}return attributes;}}
```
%%// summary.js

%% summary.css
```css
body{font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f1f1f1;}h1{text-align: center; margin-top: 50px;}.container{display: flex; justify-content: space-around; margin-top: 50px;}.input, .output{width: 45%; height: 300px; padding: 10px; font-size: 16px; border: 2px solid #ccc; border-radius: 5px; resize: none;}.output{background-color: #fff; color: #000;}button{font-size: 16px; padding: 10px; border-radius: 5px; border: none; background-color: #4CAF50; color: #fff; cursor: pointer; transition: all 0.3s ease;}button:hover{background-color: #3e8e41;}
```
%%// summary.css


## Begin task