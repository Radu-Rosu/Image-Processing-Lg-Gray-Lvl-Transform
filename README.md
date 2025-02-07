# JavaScript Application Image-Processing-Logarithmic-Gray-Level-Transform  
**Author:** Radu Codreanu 

## 1. Application Description  
The application performs image processing using JavaScript, HTML, and CSS. Images are retrieved from a public API (Dog API: [https://dog.ceo/dog-api/](https://dog.ceo/dog-api/)) and processed in real time on a canvas element. There are two processing options:  
- **Mirror and Logarithmic Gray Level Transform**  
- **Slice (on the left half of the image) and Logarithmic Gray Level Transform**  

Additionally, the application displays the processing time for each chunk and the total processing time for the entire image.  

## 2. Theoretical Background  
### Image Processing in the Browser  
Image processing in the browser is performed using the HTML5 canvas element, which allows pixel manipulation through low-level methods. Each pixel is defined by RGBA values (Red, Green, Blue, Alpha - opacity/transparency/intensity), and operations on pixels are implemented through matrix calculations.  

### Logarithmic Gray Level Transform  
This technique applies a logarithmic transformation to the intensity (opacity) values of a pixel. The formula used is:  

\[
S = c \cdot \log(1 + r)
\]

Where:  
- **S**: the output value (transformed pixel).  
- **r**: the initial pixel value.  
- **c = 255 / \log(256)**: scaling factor to ensure intensity values remain within the range [0, 255].  

### Asynchronous Processing on Chunks  
Chunk processing involves dividing the image into four vertical segments of approximately equal height and processing each section separately. This technique optimizes performance and leverages asynchronous functions to prevent UI blocking.  

## 3. Implementation Description  
### Project Structure  
- **HTML - `index.html`**  
  - Creates the user interface: a canvas element for image display, sections for JSON data display (API query results and the fetched image), and processing time statistics.  
  - Buttons allow users to initiate processing and save the processed image.  

- **CSS - `styles.css`**  
  - Defines modern styles for an enhanced visual experience. The page background is light green, and the purple buttons include animations for user interaction feedback.  

- **JavaScript - `script.js`**  
  - Manages the application's logic:  
    - Asynchronous image retrieval from the Dog API.  
    - Image processing on canvas using the specified options.  
    - Calculation and display of processing times for each chunk.  

### Implementation Steps  
#### 1. Image Generation  
An image is fetched from the Dog API through an asynchronous request (`fetch`).  

#### 2. Image Processing  
Pixels are manipulated using low-level methods (`getImageData`, `putImageData`). Two processing options are available:  
- **Mirror (vertical reflection) and logarithmic transformation**  
- **Slice (left half of the image) and logarithmic transformation**  

Processing is performed on four chunks, each displaying its processing time. The total processing time for all four chunks is also displayed.  

#### 3. Displaying Results  
Processing times for each chunk are displayed in a clear and readable format (milliseconds). The average processing time per chunk is observed to be slightly above 1000ms.  

#### 4. Image Saving  
The user can download the processed image using a dedicated button.  

## 4. Functional Description of the Implemented Application  
- Pressing the **"Generate new image"** button fetches a new image from the Dog API and displays it on the canvas.  
- The user can select one of two processing options:  
  - **"Process Mirror + Log Transform"**  
  - **"Process Slice + Log Transform"**  
- After processing, the time for each chunk and the total processing time are displayed.  
- The processed image can be downloaded by clicking the **"Save Processed Image"** button.  

## 5. Module Description  
### **HTML**  
Defines the visual structure:  
- Canvas element for image processing.  
- Buttons for user interaction.  
- Section for displaying processing times and JSON data.  

### **CSS**  
- Light green background for a relaxed visual experience.  
- Purple buttons with click animations for interactive feedback.  

### **JavaScript**  
- **Asynchronous Image Fetching**  
  - Uses the Dog API to retrieve random images.  
  - Displays the JSON data associated with the image.  

- **Pixel Processing**  
  - Performs pixel matrix operations for mirroring and slicing.  
  - Applies logarithmic transformation to pixel values.  

- **Processing Time Calculation**  
  - Displays the processing duration for each chunk and the total processing time.  

- **Image Saving**  
  - Generates a download link for the processed image.  

## 6. References  
- **Dog API Documentation:** [https://dog.ceo/dog-api/](https://dog.ceo/dog-api/)  
- **Mozilla Developer Network (MDN):** Canvas API  
- **Image Processing Transformations:**  
  - Gonzalez, R.C., & Woods, R.E. (2018). *Digital Image Processing.* Pearson.  
- **Asynchronous JavaScript Tutorials (MDN):** [https://developer.mozilla.org](https://developer.mozilla.org)  
