
/* Copyright Coding With Nick - Nikhil raghuwanshi */
/* https://codingwithnick.in/ */



// JavaScript to hide the preloader when the page is fully loaded
window.addEventListener('load', function () {
    document.querySelector('.preloader').style.display = 'none';
});

// Function to upload images
function uploadImage() {
    const input = document.getElementById('imageUpload');
    input.click();
    input.onchange = function (event) {
        const files = event.target.files;
        const preview = document.getElementById('preview');
        preview.innerHTML = '';
        Array.from(files).forEach(file => {
            const reader = new FileReader();
            reader.onload = function () {
                const img = document.createElement('img');
                img.src = reader.result;
                img.classList.add('preview-image');
                img.addEventListener('click', showTab);
                const name = document.createElement('span');
                name.textContent = file.name;
                name.classList.add('image-name');
                const item = document.createElement('div');
                item.classList.add('preview-item');
                item.appendChild(img);
                item.appendChild(name);
                preview.appendChild(item);
            };
            reader.readAsDataURL(file);
        });
        document.getElementById('downloadBtn').style.display = 'inline-block';
    };
}

// Function to show tab
function showTab(event) {
    const index = event.target.getAttribute('data-index');
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.style.display = 'none');
    tabs[index].style.display = 'block';
}

// Function to download images
function downloadImages() {
    const images = document.querySelectorAll('.preview-image');
    const inputFiles = document.getElementById('imageUpload').files;
    const originalFileNames = Array.from(inputFiles).map(file => file.name);
    const zip = new JSZip();

    images.forEach((image, index) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(blob => {
            const originalFileName = originalFileNames[index];
            const fileName = originalFileName.replace(/\.[^/.]+$/, "") + ".webp";
            zip.file(fileName, blob);
            if (index === images.length - 1) {
                zip.generateAsync({ type: "blob" }).then(function (content) {
                    const a = document.createElement('a');
                    a.href = URL.createObjectURL(content);
                    a.download = "Webp_image.zip";
                    a.click();
                });
            }
        }, 'image/webp', 0.5);
    });
}

// Function to update size comparison
function updateSizeComparison() {
    const images = document.querySelectorAll('.preview-image');
    const quality = parseFloat(document.getElementById('compressionSlider').value) / 100;
    const sizeComparison = document.getElementById('sizeComparison');
    sizeComparison.innerHTML = '';
    images.forEach(image => {
        const originalSize = Math.round(image.src.length / 1024);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        const convertedSize = Math.round(canvas.toDataURL('image/webp', quality).length / 1024);
        sizeComparison.innerHTML += `Original Size: ${originalSize}KB, Converted Size: ${convertedSize}KB<br>`;
    });
}

// Slider and output update
const slider = document.getElementById('compressionSlider');
const output = document.getElementById('compressionValue');
output.innerHTML = slider.value + '%';
slider.oninput = function () {
    output.innerHTML = this.value + '%';
    updateSizeComparison();
};


/* Copyright Coding With Nick - Nikhil raghuwanshi */
/* https://codingwithnick.in/ */
