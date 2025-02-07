// Select DOM elements
const fetchImageButton = document.getElementById('fetch-image');
const mirrorTransformButton = document.getElementById('mirror-transform');
const sliceTransformButton = document.getElementById('slice-transform');
const jsonDataDiv = document.getElementById('json-data');
const canvas = document.getElementById('image-canvas');
const resultsDiv = document.getElementById('results');

const ctx = canvas.getContext('2d');
canvas.width = 500;
canvas.height = 500;

// Function to fetch a new dog image and display JSON data
async function fetchDogImage() {
    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();
        
        // Display JSON data
        jsonDataDiv.textContent = JSON.stringify(data, null, 2);

        // Load image into canvas
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = data.message;
        image.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
    } catch (error) {
        console.error('Error fetching dog image:', error);
    }
}

// Function to apply mirror + logarithmic transformation
async function applyMirrorTransform() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;

    // Mirror the image
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width / 2; x++) {
            const leftIndex = (y * width + x) * 4;
            const rightIndex = (y * width + (width - x - 1)) * 4;

            for (let i = 0; i < 4; i++) {
                const temp = data[leftIndex + i];
                data[leftIndex + i] = data[rightIndex + i];
                data[rightIndex + i] = temp;
            }
        }
    }

    // Apply logarithmic gray-level transform asynchronously
    processInChunks(data, width, height, (pixel) => {
        const gray = 0.299 * pixel[0] + 0.587 * pixel[1] + 0.114 * pixel[2];
        const transformed = 255 * Math.log(1 + gray) / Math.log(256);
        return [transformed, transformed, transformed, pixel[3]];
    });

    ctx.putImageData(imageData, 0, 0);
}

// Function to apply slicing + logarithmic transformation
async function applySliceTransform() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = imageData;

    // Process only the left half of the image
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width / 2; x++) {
            const index = (y * width + x) * 4;

            const gray = 0.299 * data[index] + 0.587 * data[index + 1] + 0.114 * data[index + 2];
            const transformed = 255 * Math.log(1 + gray) / Math.log(256);

            data[index] = data[index + 1] = data[index + 2] = transformed;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

// Function to process data in chunks
function processInChunks(data, width, height, transformFunction) {
    const chunkSize = Math.floor(height / 4);

    for (let chunk = 0; chunk < 4; chunk++) {
        setTimeout(() => {
            for (let y = chunk * chunkSize; y < (chunk + 1) * chunkSize && y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const index = (y * width + x) * 4;
                    const pixel = [data[index], data[index + 1], data[index + 2], data[index + 3]];

                    const [r, g, b, a] = transformFunction(pixel);
                    data[index] = r;
                    data[index + 1] = g;
                    data[index + 2] = b;
                    data[index + 3] = a;
                }
            }
            resultsDiv.textContent += `Processed chunk ${chunk + 1} at ${new Date().toLocaleTimeString()}\n`;
        }, chunk * 1000);
    }
}

// Event listeners
fetchImageButton.addEventListener('click', fetchDogImage);
mirrorTransformButton.addEventListener('click', applyMirrorTransform);
sliceTransformButton.addEventListener('click', applySliceTransform);
