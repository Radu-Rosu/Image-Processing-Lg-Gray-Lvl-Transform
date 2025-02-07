const apiUrl = "https://dog.ceo/api/breeds/image/random";
const canvas = document.getElementById("image-canvas");
const ctx = canvas.getContext("2d");
const timingDisplay = document.getElementById("timing-display");

let image = null;

// Fetch and display a new image
async function fetchImage() {
    timingDisplay.innerHTML = ""; // Clear previous timings
    const response = await fetch(apiUrl);
    const data = await response.json();
    const imageUrl = data.message;

    document.getElementById("json-display").textContent = JSON.stringify(data, null, 2);

    image = new Image();
    image.crossOrigin = "Anonymous";
    image.onload = () => {
        // Set fixed canvas size
        const canvasSize = 500;
        canvas.width = canvasSize;
        canvas.height = canvasSize;

        // Calculate scaling factors to maintain aspect ratio
        const scale = Math.min(canvasSize / image.width, canvasSize / image.height);
        const x = (canvasSize - image.width * scale) / 2;
        const y = (canvasSize - image.height * scale) / 2;

        // Draw scaled image on canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, image.width, image.height, x, y, image.width * scale, image.height * scale);
    };
    image.src = imageUrl;
}


// Process Mirror + Log Transform
async function processMirror() {
    if (!image) return alert("Generate an image first!");
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = pixels;

    const startTime = Date.now(); // Timp inițial pentru calculul duratei totale
    for (let chunk = 0; chunk < 4; chunk++) {
        const chunkStartTime = Date.now(); // Timp pentru fiecare chunk
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulează procesarea

        const startRow = Math.floor((chunk * height) / 4);
        const endRow = Math.floor(((chunk + 1) * height) / 4);

        for (let y = startRow; y < endRow; y++) {
            for (let x = 0; x < width / 2; x++) {
                const index = (y * width + x) * 4;
                const mirrorIndex = (y * width + (width - x - 1)) * 4;

                // Swap pixels (mirror effect)
                for (let i = 0; i < 3; i++) {
                    const temp = data[index + i];
                    data[index + i] = data[mirrorIndex + i];
                    data[mirrorIndex + i] = temp;
                }

                // Apply Log Transform
                for (let i = 0; i < 3; i++) {
                    data[index + i] = 255 * Math.log(1 + data[index + i]) / Math.log(256);
                }
            }
        }

        const chunkEndTime = Date.now();
        const chunkDuration = chunkEndTime - chunkStartTime; // Durata procesării chunk-ului
        timingDisplay.innerHTML += `Chunk ${chunk + 1}: ${chunkDuration} ms<br>`;
        ctx.putImageData(pixels, 0, 0);
    }
    const totalDuration = Date.now() - startTime; // Durata totală
    timingDisplay.innerHTML += `<b>Total Processing Time: ${totalDuration} ms<br></br></b>`;
}


// Process Slice + Log Transform
async function processSlice() {
    if (!image) return alert("Generate an image first!");
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const { data, width, height } = pixels;

    const startTime = Date.now(); // Timp inițial pentru calculul duratei totale
    for (let chunk = 0; chunk < 4; chunk++) {
        const chunkStartTime = Date.now(); // Timp pentru fiecare chunk
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulează procesarea

        const startRow = Math.floor((chunk * height) / 4);
        const endRow = Math.floor(((chunk + 1) * height) / 4);

        for (let y = startRow; y < endRow; y++) {
            for (let x = 0; x < width / 2; x++) { // Doar pe jumătatea din stânga
                const index = (y * width + x) * 4;

                // Apply Log Transform pe jumătatea stângă
                for (let i = 0; i < 3; i++) {
                    data[index + i] = 255 * Math.log(1 + data[index + i]) / Math.log(256);
                }
            }
        }

        const chunkEndTime = Date.now();
        const chunkDuration = chunkEndTime - chunkStartTime; // Durata procesării chunk-ului
        timingDisplay.innerHTML += `Chunk ${chunk + 1}: ${chunkDuration} ms<br>`;
        ctx.putImageData(pixels, 0, 0);
    }
    const totalDuration = Date.now() - startTime; // Durata totală
    timingDisplay.innerHTML += `<b>Total Processing Time: ${totalDuration} ms<br></br></b>`;
}


// Save Processed Image
function saveImage() {
    if (!image) return alert("Generate an image first!");
    const link = document.createElement("a");
    link.download = "processed-image.png";
    link.href = canvas.toDataURL();
    link.click();
}

// Event listeners
document.getElementById("generate-image").addEventListener("click", fetchImage);
document.getElementById("process-mirror").addEventListener("click", processMirror);
document.getElementById("process-slice").addEventListener("click", processSlice);
document.getElementById("save-image").addEventListener("click", saveImage);
