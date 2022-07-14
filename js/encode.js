const inputCanvas = document.getElementById('input-canvas');
const inputCtx = inputCanvas.getContext('2d');

const coverCanvas = document.getElementById('cover-canvas');
const coverCtx = coverCanvas.getContext('2d');

const outputCanvas = document.getElementById('output-canvas');
const outputCtx = outputCanvas.getContext('2d');

inputCtx.fillStyle = '#0078AA';
inputCtx.font = '0.8em monospace';
inputCtx.textBaseline = 'middle';
inputCtx.textAlign = 'center';
inputCtx.fillText('Hide this', 150, 70);

coverCtx.fillStyle = '#0078AA';
coverCtx.font = '0.8em monospace';
coverCtx.textBaseline = 'middle';
coverCtx.textAlign = 'center';
coverCtx.fillText('In this', 150, 70);

// outputCtx.fillStyle = '#0078AA';
// outputCtx.font = '0.8em monospace';
// outputCtx.textBaseline = 'middle';
// outputCtx.textAlign = 'center';
// outputCtx.fillText('Output Image', 150, 70);

const outputCont = document.getElementById('output-container')
const createBtn = document.getElementById('create-button');

let inputImage;
let coverImage;

/**
 * Load input image to input canvas
 * 
 * @param {string} input ID of input type="file"
 */
const loadInputImage = input => {
    let image = document.getElementById(input);
    inputImage = new SimpleImage(image);
    
    inputImage.drawTo(inputCanvas);

    outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
    outputCont.style.display = "none";
};

/**
 * Load cover image to cover canvas
 * 
 * @param {string} input ID of input type="file"
 */
const loadCoverImage = input => {
    let image = document.getElementById(input);
    coverImage = new SimpleImage(image);
    
    coverImage.drawTo(coverCanvas);

    createBtn.style.display = "block";

    outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
    outputCont.style.display = "none";
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
    
    // Disable create secret image button 
    createBtn.disabled = true;

    try {
        const outputImage = generateSecretImage();
        outputCont.style.display = "block";
        outputImage.drawTo(outputCanvas);
        console.log('Done.');
    } catch (error) {
        console.error(error.message);
    }
    
    // Enable create secret image button 
    createBtn.innerText = "Hide"
    createBtn.disabled = false;
};