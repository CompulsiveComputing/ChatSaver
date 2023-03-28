/* popup.js */
var recording = false;
var toggleButton = document.getElementById('toggleButton');
var folderPathText = document.getElementById('folderPath');
var notifications = document.getElementById('notifications');

/* Set the icon and text based on the recording state */
function setIconAndText() {
  if (recording) {
    toggleButton.style.background = 'green';
    toggleButton.textContent = 'Recording';
  } else {
    toggleButton.style.background = 'yellow';
    toggleButton.textContent = 'Not Recording';
  }
}

/* Set the initial icon and text */
setIconAndText();

/* Set the folder path text */
updateFolderPath();

/* Add an event listener to the toggle button */
toggleButton.addEventListener('click', function () {
  /* Toggle the recording state */
  recording = !recording;
  /* Set the icon and text based on the recording state */
  setIconAndText();
  /* Send a message to the background script to toggle the recording state */
  browser.runtime.sendMessage({recording: recording});
});

/* Display a notification */
function showNotification(message) {
  notifications.innerHTML += message + '<br>';
}

/* Update the folder path text */
function updateFolderPath() {
  browser.runtime.sendMessage({getFolderPath: true}, function (response) {
    folderPathText.textContent = response.folderPath;
  });
}
