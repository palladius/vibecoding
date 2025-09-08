const imageDropArea = document.getElementById('image-drop-area');
const image1Placeholder = document.getElementById('image1');
const image2Placeholder = document.getElementById('image2');

console.log('🍌 ElectroBanana renderer process loaded');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  imageDropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
  imageDropArea.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
  imageDropArea.addEventListener(eventName, unhighlight, false);
});

function highlight(e) {
  imageDropArea.classList.add('dragover');
}

function unhighlight(e) {
  imageDropArea.classList.remove('dragover');
}

imageDropArea.addEventListener('drop', handleDrop, false);

let imagePaths = [];

function handleDrop(e) {
  const dt = e.dataTransfer;
  const files = dt.files;

  handleFiles(files);
}

function handleFiles(files) {
  files = [...files];
  files.forEach(previewFile);
  imagePaths.push(...files.map(f => f.path));
  console.log('Image paths:', imagePaths);
}

function previewFile(file) {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onloadend = function() {
    const img = document.createElement('img');
    img.src = reader.result;
    if (!image1Placeholder.hasChildNodes()) {
        image1Placeholder.innerHTML = '';
        image1Placeholder.appendChild(img);
    } else if (!image2Placeholder.hasChildNodes()) {
        image2Placeholder.innerHTML = '';
        image2Placeholder.appendChild(img);
    }
  }
}

