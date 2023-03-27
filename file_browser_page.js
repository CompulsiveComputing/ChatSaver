import { sanitizeFilename, getById , makeE, bMessage} from './utils.js';

(async function () {
    const storage = browser.storage.local;
    const { recordingFolder } = await storage.get("recordingFolder");
    const fileList = getById("file-list");
    const directoryTree = getById("directory-tree");
  
    async function createFileList(folderPath) {
      const files = await browser.downloads.search({ directory: folderPath });
      const ul = makeE('ul');
      files.forEach((file) => {
        const li = makeE('li');
        const a = makeE('a');
        a.href = URL.createObjectURL(file.url);
        a.textContent = file.filename;
        a.download = file.filename;
        const checkbox = makeE('input');
        checkbox.type = 'checkbox';
        checkbox.dataset.fileId = file.id;
        li.insertBefore(checkbox, a);
        li.appendChild(a);
        ul.appendChild(li);
      });
      fileList.innerHTML = '';
      fileList.appendChild(ul);
    }
  
    async function createDirectoryTree() {
      const files = await browser.downloads.search({ directory: recordingFolder });
      const directories = {};
      files.forEach((file) => {
        const dir = file.directory.slice(recordingFolder.length + 1).split('/')[0];
        if (!directories[dir]) {
          directories[dir] = [];
        }
        directories[dir].push(file);
      });
      const ul = makeE('ul');
      for (const dir in directories) {
        const li = makeE('li');
        const a = makeE('a');
        a.textContent = dir;
        a.href = '#';
        a.dataset.path = `${recordingFolder}/${dir}`;
        a.onclick = (event) => {
          event.preventDefault();
          const target = event.target;
          document.querySelectorAll('#directory-tree a').forEach((a) => a.removeAttribute('selected'));
          target.setAttribute('selected', '');
          createFileList(target.dataset.path);
        };
        if (dir === '') {
          a.setAttribute('selected', '');
          createFileList(recordingFolder);
        }
        li.appendChild(a);
        ul.appendChild(li);
      }
      directoryTree.innerHTML = '';
      directoryTree.appendChild(ul);
    }
  
    await createDirectoryTree();
  
    getById('delete-selected').addEventListener('click', async () => {
      const selectedFiles = Array.from(document.querySelectorAll('#file-list input[type="checkbox"]:checked')).map(checkbox => {
        return { id: parseInt(checkbox.dataset.fileId) };
      });
      if (selectedFiles.length > 0) {
        if (confirm('Are you sure you want to delete the selected files?')) {
          await bMessage({ action: 'deleteSelectedResponses', files: selectedFiles });
          const selectedDir = document.querySelector('#directory-tree a[selected]');
          const selectedPath = selectedDir ? selectedDir.dataset.path : recordingFolder;
          await createFileList(selectedPath);
          await createDirectoryTree();
        }
      } else {
        alert('Please select files to delete.');
      }
    });
  
    getById('download-all').addEventListener('click', async () => {
      const selectedDir = document.querySelector('#directory-tree a[selected]');
      const selectedPath = selectedDir ? selectedDir.dataset.path : recordingFolder;
      const files = await browser.downloads.search({ directory: selectedPath });
      files.forEach((file) => {
        browser.downloads.download({ url: file.url, filename: file.filename });
      });
    });
  
    getById('download-selected').addEventListener('click', async () => {
      const selectedFiles = Array.from(document.querySelectorAll('#file-list input[type="checkbox"]:checked')).map(checkbox => {
        return { url: URL.createObjectURL(checkbox.nextSibling.href), filename: checkbox.nextSibling.textContent };
      });
      if (selectedFiles.length > 0) {
        selectedFiles.forEach((file) => {
          browser.downloads.download({ url: file.url, filename: file.filename });
        });
      } else {
        alert('Please select files to download.');
      }
    });
  
  })();
  