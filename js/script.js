
const inputCanvas = document.getElementById('input-canvas');
const inputCtx = inputCanvas.getContext('2d');

const coverCanvas = document.getElementById('cover-canvas');
const coverCtx = coverCanvas.getContext('2d');

const outputCanvas = document.getElementById('output-canvas');
const outputCtx = outputCanvas.getContext('2d');

inputCtx.fillStyle = 'black';
inputCtx.font = '10px sans-serif';
inputCtx.textBaseline = 'middle';
inputCtx.textAlign = 'center';
inputCtx.fillText('Input Image', 150, 70);

coverCtx.fillStyle = 'black';
coverCtx.font = '10px sans-serif';
coverCtx.textBaseline = 'middle';
coverCtx.textAlign = 'center';
coverCtx.fillText('Cover Image', 150, 70);

outputCtx.fillStyle = 'black';
outputCtx.font = '10px sans-serif';
outputCtx.textBaseline = 'middle';
outputCtx.textAlign = 'center';
outputCtx.fillText('Output Image', 150, 70);

let inputImage = null;
let coverImage = null;

const progressBar = document.getElementById('progress-bar');

/**
 * Load image to appointed canvas
 * 
 * @param {string} canvas ID of canvas
 * @param {string} input ID of input type="file"
 */
const loadImage = (canvas, input) => {
    let cnvs = document.getElementById(canvas);
    let image = document.getElementById(input);
    let simpleImage = new SimpleImage(image);

    if (input === 'input-image') {
        inputImage = simpleImage;
    } else {
        coverImage = simpleImage;
    }

    simpleImage.drawTo(cnvs);

    outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
    progressBar.value = 0;
};

/**
 * Calculate resulting pixel from input image and cover image
 * 
 * @param {int} x Input image color value
 * @param {int} y Cover image color value
 * 
 * @return {int} Value of new color
 */
const calculatePixel = (x, y) => {
    // Combines the first 4 bits of y and the last 4 bits of x
    // to create another 0-255 number 
    return Math.floor(y/16)*16+Math.floor(x/16);
};

const generateNewPixel = pixel => {
    const x = pixel.getX();
    const y = pixel.getY();
    const coverPixel = coverImage.getPixel(x, y);

    let outputPixel = coverPixel;
    
    let newRed = calculatePixel(pixel.getRed(), coverPixel.getRed());
    let newGreen = calculatePixel(pixel.getGreen(), coverPixel.getGreen());
    let newBlue = calculatePixel(pixel.getBlue(), coverPixel.getBlue());

    outputPixel.setRed(newRed);
    outputPixel.setGreen(newGreen);
    outputPixel.setBlue(newBlue);

    return outputPixel;
};

/**
 * Generate secret image 
 */
const createSecretImage = () => {
    let outputImage = new SimpleImage(coverImage);

    document.getElementById('create-button').disabled = true;

    outputImage.values = inputImage.values().map(generateNewPixel);

    outputImage.drawTo(outputCanvas);
    
    document.getElementById('create-button').disabled = false;

    console.log('Done.');
};