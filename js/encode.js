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

let inputImage = null;
let coverImage = null;

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
};

/**
 * Calculate resulting pixel from input image and cover image
 * 
 * @param {int} x Input image color value
 * @param {int} y Cover image color value
 * 
 * @returns Value of new color
 */
const calculatePixel = (x, y) => {
    // Combines the first 4 bits of y and the last 4 bits of x
    // to create another 0-255 number 
    return (Math.floor(y / 16) * 16) + Math.floor(x / 16);
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
 * Iterate through pixels of input image to make 
 * pixels for the output image
 * 
 * @returns A Promise
 */
const iteratePixels = () => {
    return new Promise(resolve => {
        let outputImage = new SimpleImage(coverImage);
        let progressBar = document.getElementById('progress-bar');
        let width = 0;

        inputImage.values().forEach(pixel => {
            let outputPixel = outputImage.getPixel(pixel.getX(), pixel.getY());
            outputPixel = generateNewPixel(pixel);
            if (progressBar.style.width !== "100%") {
                progressBar.style.width = width + "%";
            }
        });

        resolve(outputImage);
    });
};

/**
 * Generate secret image 
 */
const createSecretImage = async () => {
    document.getElementById('create-button').disabled = true;

    const outputImage = await iteratePixels();

    outputImage.drawTo(outputCanvas);
    
    document.getElementById('create-button').disabled = false;

    console.log('Done.');
};