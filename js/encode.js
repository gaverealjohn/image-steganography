/**
 * Init
 */
const inputCanvas = document.getElementById('input-canvas');
const inputCtx = inputCanvas.getContext('2d');

const coverCanvas = document.getElementById('cover-canvas');
const coverCtx = coverCanvas.getContext('2d');

const outputCanvas = document.getElementById('output-canvas');
const outputCtx = outputCanvas.getContext('2d');

inputCtx.fillStyle = 'black';
inputCtx.font = '0.8em monospace';
inputCtx.textBaseline = 'middle';
inputCtx.textAlign = 'center';
inputCtx.fillText('Hide this', 150, 70);

coverCtx.fillStyle = 'black';
coverCtx.font = '0.8em monospace';
coverCtx.textBaseline = 'middle';
coverCtx.textAlign = 'center';
coverCtx.fillText('In this', 150, 70);

const outputCont = document.getElementById('output-container')
const createBtn = document.getElementById('create-button');
const downloadBtn = document.getElementById('download-button');
const progressBar = document.getElementById('progress-bar');

const inputInput = document.getElementById('input-image');
const coverInput = document.getElementById('cover-image');

let image;
let inputImage;
let coverImage;

/**
 * Load input image to input canvas
 * 
 * @param {string} input ID of input type="file"
 */
const loadInputImage = input => {
    image = document.getElementById(input);
    inputImage = new SimpleImage(image);
    
    inputImage.drawTo(inputCanvas);
    
    outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
    outputCont.style.display = "none";
    outputCanvas.style.display = "none";
    downloadBtn.style.display = "none";
};

/**
 * Load cover image to cover canvas
 * 
 * @param {string} input ID of input type="file"
 */
const loadCoverImage = input => {
    image = document.getElementById(input);
    coverImage = new SimpleImage(image);
    
    coverImage.drawTo(coverCanvas);

    outputCont.style.display = "flex";
    createBtn.style.display = "block";

    outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
    createBtn.disabled = false;
    outputCanvas.style.display = "none";
    downloadBtn.style.display = "none";
};

/**
 * Calculate resulting pixel from input image and cover image
 * Combines the 4 most significant bits of the cover image value 
 * and the 4 most significant bits of the input image value 
 * to create another color value 
 * 
 * input: 10110010
 * cover: 01110101
 * output: 01111011
 * 
 * @param {int} x Input image color value
 * @param {int} y Cover image color value
 * 
 * @returns New color value
 */
const calculateNewValue = (inputValue, coverValue) => {
    return (Math.floor(coverValue / 16) * 16) + Math.floor(inputValue / 16);
};

/**
 * Iterate through pixels of input image to make 
 * pixels for the output image
 * 
 * @returns A new image
 */
const generateSecretImage = () => {
    if (!inputImage || !coverImage)
        return new Error('Missing image.');

    let outputImage = coverImage;

    inputImage.values().forEach(pixel => {
        const x = pixel.getX();
        const y = pixel.getY();
        const coverPixel = coverImage.getPixel(x, y);
        
        let newRed = calculateNewValue(pixel.getRed(), coverPixel.getRed());
        let newGreen = calculateNewValue(pixel.getGreen(), coverPixel.getGreen());
        let newBlue = calculateNewValue(pixel.getBlue(), coverPixel.getBlue());
        
        outputImage.getPixel(x, y).setRed(newRed);
        outputImage.getPixel(x, y).setGreen(newGreen);
        outputImage.getPixel(x, y).setBlue(newBlue);
    });

    return outputImage;
};

/**
 * Generate secret image 
 */
const createSecretImage = () => {
    // Checks if cover image is compatible
    // Cover image should be similar or higher
    // in resolution with the input image
    if (coverImage.getWidth() < inputImage.getWidth() || coverImage.getHeight() < inputImage.getHeight()) {
        console.error('Cover image incompatible.');

        const errContainer = document.getElementById('error-msg');
        errContainer.style.color = "red";
        errContainer.innerText = "Cover Image is too small.";
        
        return;
    }
    
    // Disable create button 
    createBtn.disabled = true;

    try {
        const outputImage = generateSecretImage();

        // Hide create secret image button 
        createBtn.style.display = "none";
        outputCont.style.display = "block";
        // Show output canvas 
        outputCanvas.style.display = "flex";
        
        outputImage.drawTo(outputCanvas);

        downloadBtn.style.display = "block";
        console.log('Done.');
    } catch (error) {
        console.error(error.message);
    }
};