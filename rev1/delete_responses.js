async function deleteSelectedResponses(selectedFiles) {
    for (const file of selectedFiles) {
      await browser.downloads.removeFile(file.id);
      await browser.downloads.erase({ id: file.id });
    }
  }
  
  document.getElementById('delete-selected').addEventListener('click', async () => {
    const selectedFiles = Array.from(document.querySelectorAll('#file-list input[type="checkbox"]:checked')).map(checkbox => {
      return { id: parseInt(checkbox.dataset.fileId) };
    });
  
    if (selectedFiles.length > 0) {
      if (confirm('Are you sure you want to delete the selected files?')) {
        await deleteSelectedResponses(selectedFiles);
        createFileList(document.querySelector('#directory-tree a[selected]').getAttribute('data-path'));
      }
    } else {
      alert('Please select files to delete.');
    }
  });
  