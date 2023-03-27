function getNestedElements(htmlString) {
    const parser = new DOMParser();
    const domTree = parser.parseFromString(htmlString, "text/html");
    return domNodeToNestedArray(domTree.documentElement);

    function domNodeToNestedArray(node) {
        if (!node) {
            return [];
        }
        if (node.nodeType === Node.TEXT_NODE) {
            return node.nodeValue.trim();
        }
        const tagName = node.tagName.toLowerCase();
        const attributes = getAttributes(node);
        const children = Array.from(node.childNodes).map(domNodeToNestedArray);
        if (attributes) {
            return [tagName, children, attributes];
        } else {
            return [tagName, children];
        }
    }

    function getAttributes(node) {
        const attributes = {};
        for (const attr of node.attributes) {
            attributes[attr.name] = attr.value;
        }
        return attributes;
    }
}

function generateFileSummary() {
    const inputTextarea = document.getElementById("file-input");
    const outputTextarea = document.getElementById("file-summary");
    const fileType = document.querySelector('input[name="file-type"]:checked').value;
    let fileSummary = "";

    if (fileType === "html") {
        const htmlString = inputTextarea.value;
        const nestedArray = getNestedElements(htmlString);
        fileSummary = JSON.stringify(nestedArray);
    } else if (fileType === "css") {
        const cssString = inputTextarea.value;
        const cssSelectors = getSelectors(cssString);
        fileSummary = JSON.stringify(cssSelectors);
    } else if (fileType === "js") {
        const jsString = inputTextarea.value;
        const functionHeaders = getFunctionHeaders(jsString);
        fileSummary = JSON.stringify(functionHeaders);
    }

    outputTextarea.value = fileSummary;
}



function generateSummary(inputHTML) {
    const parser = new DOMParser();
    const domTree = parser.parseFromString(inputHTML, "text/html");
    const nestedArray = domNodeToNestedArray(domTree.documentElement);

    const output = {
        "html": JSON.stringify(nestedArray),
        "css": getSelectors(inputHTML),
        "js": getFunctionNames(summaryJS),
    };

    return "```\n" + JSON.stringify(output, null, "") + "\n```";
}

function domNodeToNestedArray(node) {
    if (!node) {
        return [];
    }
    if (node.nodeType === Node.TEXT_NODE) {
        return node.nodeValue.trim();
    }
    const tagName = node.tagName.toLowerCase();
    const attributes = getAttributes(node);
    const children = Array.from(node.childNodes).map(domNodeToNestedArray);
    if (attributes) {
        return [tagName, children, attributes];
    } else {
        return [tagName, children];
    }
}

function getAttributes(node) {
    const attributes = {};
    for (const attr of node.attributes) {
        attributes[attr.name] = attr.value;
    }
    return attributes;
}

function getSelectors(cssString) {
    const cssSelectors = new Set();
    const regex = /([.#]?[A-Za-z0-9-_]+)\s*{[^}]*}/g;
    let match;
    while ((match = regex.exec(cssString))) {
        cssSelectors.add(match[1]);
    }
    return [...cssSelectors];
}

function getFunctionHeaders(jsString) {
    const functionHeaders = [];
    const regex = /(function\s+\w+\s*\([^)]*\))\s*{[^}]*}/g;
    let match;
    while ((match = regex.exec(jsString))) {
        functionHeaders.push(match[1]);
    }
    return functionHeaders;
}




function getNestedElements(htmlString) {
    const parser = new DOMParser();
    const domTree = parser.parseFromString(htmlString, "text/html");
    return domNodeToNestedArray(domTree.documentElement);

    function domNodeToNestedArray(node) {
        if (!node) {
            return [];
        }
        if (node.nodeType === Node.TEXT_NODE) {
            return node.nodeValue.trim();
        }
        const tagName = node.tagName.toLowerCase();
        const attributes = getAttributes(node);
        const children = Array.from(node.childNodes).map(domNodeToNestedArray);
        return [tagName, children, attributes];
    }

    function getAttributes(node) {
        const attributes = {};
        for (const attr of node.attributes) {
            attributes[attr.name] = attr.value;
        }
        return attributes;
    }
}

