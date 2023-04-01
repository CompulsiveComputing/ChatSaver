let fileModal = false;
let chatData = null;
let collatedContent = null;
let traversalButtons = null;
let searchInput = null;
let dragging = false;

document.addEventListener('DOMContentLoaded', domLoadedListener);
window.addEventListener("hashchange", hasChangeListener);

function hasChangeListener() {
  var hash = window.location.hash;
  var sections = document.querySelectorAll("section.url_able");

  for (var i = 0; i < sections.length; i++) {
    if ("#" + sections[i].id === hash) {
      sections[i].classList.add("active");
    } else {
      sections[i].classList.remove("active");
    }
  }
}

function domLoadedListener() {
  console.log('DOM loaded');
  fileModal = document.querySelector('modal.dropzone');
  traversalButtons = document.getElementById('traversalButtons');
  searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', handleSearchInputChange);

  document.getElementById('fileInput').addEventListener('change', handleFileInputChange);

  document.getElementById('loadButton').addEventListener('click', () => {
    document.getElementById('fileInput').click();
  });

  document.body.addEventListener('dragover', dragOverListener);
  document.body.addEventListener('dragenter', dragEnterListener);
  document.body.addEventListener('dragleave', dragLeaveListener);
  document.body.addEventListener('drop', dropListener, true);

}

function dragOverListener(e) {
  if (dragging) {
    e.preventDefault();
    e.stopPropagation();
  }
}

function dragEnterListener(e) {
  if (dragging) return false;
  if (e.clientX >= 0 && e.clientX <= window.innerWidth && e.clientY >= 0 && e.clientY <= window.innerHeight) {
    console.log('dragEnterListener', dragging);
    fileModal.classList.add('draggedOver');
    e.preventDefault();
    e.stopPropagation();
    dragging = true;
  }
}

function dragLeaveListener(e) {
  if (!dragging) return false;
  if (e.clientX < 0 || e.clientX > window.innerWidth || e.clientY < 0 || e.clientY > window.innerHeight) {
    console.log('dragLeaveListener', dragging);
    fileModal.classList.remove('draggedOver');
    e.preventDefault();
    e.stopPropagation();
    dragging = false;
  }
}

function dropListener(e) {
  console.log('dropListener', e);
  e.preventDefault();
  e.stopPropagation();
  fileModal.classList.remove('visible');
  const files = e.dataTransfer.files;
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    processFile(file, i);
  }
  handleFilesLoaded();
}

function handleFileInputChange(e) {
  const files = e.target.files;
  for (let i = 0; i < files.length; i++) {
    processFile(files[i], i);
  } handleFilesLoaded();
}

function processFile(file, index) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const extension = file.name.split('.').pop();
      let json;
      if (extension === 'json') {
        json = JSON.parse(e.target.result);
      } else if (extension === 'jsonl') {
        json = e.target.result.trim().split('\n').map(line => JSON.parse(line));
      } else {
        alert("Invalid file format. Please select a valid JSON or JSONL file.");
        return;
      }
      if (isValidChatJson(json)) {
        chatData = chatData || [];
        chatData[index] = json;
      } else {
        alert("Invalid file format. Please select a valid JSON or JSONL file.");
      }
    } catch (err) {
      console.error('Error parsing JSON:', err);
    }
  };
  reader.readAsText(file);
}


function isValidChatJson(json) {
  return true;
  if (!json || !Array.isArray(json.messages)) return false;
  for (let message of json.messages) {
    if (!message.sender || !message.text || typeof message.sender !== 'string' || typeof message.text !== 'string') {
      return false;
    }
  }
  return true;
}


function handleSearchInputChange() {
  const searchTerm = searchInput.value.trim();
  if (searchTerm.length < 3) {
    collatedContent.innerHTML = '';
    collatedContent.appendChild(createCollatedContent(chatData));
    return;
  }

  const searchResults = chatData.reduce((acc, data) => {
    /*  Implement search logic here */
    return acc.concat(searchData(data, searchTerm));
  }, []);

  if (searchResults.length === 0) {
    collatedContent.innerHTML = '<p>No search results found.</p>';
  } else {
    collatedContent.innerHTML = '';
    collatedContent.appendChild(createCollatedContent(searchResults));
  }
}

function searchData(data, searchTerm) {
  const searchResults = [];
  for (let message of data.messages) {
    if (message.sender.toLowerCase().includes(searchTerm.toLowerCase()) || message.text.toLowerCase().includes(searchTerm.toLowerCase())) {
      searchResults.push(message);
    }
  }
  return searchResults;
}

function handleFilesLoaded() {
  collatedContent = document.getElementById('collatedContent');
  if(!collatedContent || !chatData) return;
  collatedContent.innerHTML = '';
  collatedContent.appendChild(createCollatedContent(chatData));
  createTraversalButtons();
}

function createTraversalButtons() {
  const buttons = createButtons(chatData);
  traversalButtons.innerHTML = '';
  traversalButtons.appendChild(buttons);
}

function createButtons(data) {
  const ul = document.createElement('ul');
  ul.className = 'traversal-buttons';
  for (let i = 0; i < data.length; i++) {
    const button = document.createElement('button');
    button.textContent = `Chat ${i + 1}`;
    button.addEventListener('click', handleTraversalButtonClick);
    const li = document.createElement('li');
    li.appendChild(button);
    ul.appendChild(li);
  }
  return ul;
}

function handleTraversalButtonClick(e) {
  const index = Array.from(traversalButtons.querySelectorAll('button')).indexOf(e.target);
  collatedContent.innerHTML = '';
  collatedContent.appendChild(createCollatedContent(chatData[index]));
}

function createCollatedContent(data) {
  const ul = document.createElement('ul');
  ul.className = 'chat-lines';

  console.log(data);
  if(!data) return;

  for (let i = 0; i < data.length; i++) {
    const messages = data[i].messages;
    for (let j = 0; j < messages.length; j++) {
      const li = document.createElement('li');
      li.textContent = `${messages[j].sender}: ${messages[j].text}`;
      ul.appendChild(li);
    }
  }

  return ul;
}


function saveCollatedContents() {
  const collatedMessages = collatedContent.innerHTML;
  localStorage.setItem('collatedMessages', collatedMessages);
}

function loadCollatedContents() {
  const collatedMessages = localStorage.getItem('collatedMessages');
  if (collatedMessages) {
    collatedContent.innerHTML = collatedMessages;
  }
}

function displayJsonData(data) {
  const jsonDataElement = document.getElementById('json-data');

  jsonDataElement.innerHTML = '';

  const ul = document.createElement('ul');

  data.messages.forEach(message => {
    const li = document.createElement('li');
    li.textContent = `${message.sender}: ${message.text}`;
    ul.appendChild(li);
  });

  jsonDataElement.appendChild(ul);
}