document.getElementById('download-btn').addEventListener('click', () => {

    // Create an instance of the CompressedBlob class
    const compressedBlob = new CompressedBlob();

    // Add three files with numbered content to the compressed blob
    compressedBlob.addFile("file1.txt", "1\n");
    compressedBlob.addFile("file2.txt", "2\n");
    compressedBlob.addFile("file3.txt", "3\n");

    

    const blob = new Blob([], { type: "application/zip" });
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({
        url: url,
        filename: 'test.zip',
        saveAs: true
    }, function (downloadId) {
        console.log("Download started with ID: " + downloadId);
    });
    URL.revokeObjectURL(url);
});

console.log("howdy");

class CompressedBlob {
    constructor() {
        this.zip = new ZipWriter();
    }

    addFile(name, blob) {
        this.zip.add(name, blob);
    }

    getBlob(callback) {
        return this.zip.close(callback);
    }
} F