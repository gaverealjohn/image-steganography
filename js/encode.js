const inputCanvas = document.getElementById('input-canvas');
const inputCtx = inputCanvas.getContext('2d');

const coverCanvas = document.getElementById('cover-canvas');
const coverCtx = coverCanvas.getContext('2d');

const outputCanvas = document.getElementById('output-canvas');
const outputCtx = outputCanvas.getContext('2d');

inputCtx.fillStyle = 'black';
inputCtx.font = '1em sans-serif';
inputCtx.textBaseline = 'middle';
inputCtx.textAlign = 'center';
inputCtx.fillText('Input Image', 150, 70);

coverCtx.fillStyle = 'black';
coverCtx.font = '1em sans-serif';
coverCtx.textBaseline = 'middle';
coverCtx.textAlign = 'center';
coverCtx.fillText('Cover Image', 150, 70);

outputCtx.fillStyle = 'black';
outputCtx.font = '1em sans-serif';
outputCtx.textBaseline = 'middle';
outputCtx.textAlign = 'center';
outputCtx.fillText('Output Image', 150, 70);

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

    outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
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
 * @returns A Promise
 */
const generateSecretImage = () => {
    return new Promise((resolve, reject) => {
        if (!inputImage || !coverImage)
            reject(new Error('Missing image.'));

        let outputImage = new SimpleImage(coverImage.getWidth(), coverImage.getHeight());

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

        resolve(outputImage);
    });
};

/**
 * Generate secret image 
 */
const createSecretImage = async () => {
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
    document.getElementById('create-button').disabled = true;

    try {
        
        const outputImage = await generateSecretImage();
        outputImage.drawTo(outputCanvas);
        console.log('Done.');
    } catch (error) {
        console.error(error.message);
    }
    
    // Enable create secret image button 
    document.getElementById('create-button').disabled = false;
};