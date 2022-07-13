const inputCanvas = document.getElementById('input-canvas');
const inputCtx = inputCanvas.getContext('2d');

const outputCanvas = document.getElementById('output-canvas');
const outputCtx = outputCanvas.getContext('2d');

inputCtx.fillStyle = 'black';
inputCtx.font = '1em sans-serif';
inputCtx.textBaseline = 'middle';
inputCtx.textAlign = 'center';
inputCtx.fillText('Input Image', 150, 70);

outputCtx.fillStyle = 'black';
outputCtx.font = '1em sans-serif';
outputCtx.textBaseline = 'middle';
outputCtx.textAlign = 'center';
outputCtx.fillText('Output Image', 150, 70);

let inputImage = null;
let outputImage = null;

/**
 * Load input image to canvas
 */
const loadImage = () => {
    let image = document.getElementById('input-image');
    inputImage = new SimpleImage(image);
    
    inputImage.drawTo(inputCanvas);

    outputCtx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
};

/**
 * Extract the 4 least significant bits of each color value 
 * Modulo 16 takes the 4 least significant bits 
 * Multiply to 16 to make the 4 bits into the 
 * most significant bits 
 * 
 * @param {int} value Color value
 * @returns New color value
 */
const getOutputValue = value => {
    return (value % 16) * 16;
};

/**
 * Create a Promise that generates the secret image 
 * 
 * @returns Promise that generates the secret image
 */
const extractSecret = () => {
    return new Promise((resolve, reject) => {
        if (!inputImage)
            reject(new Error('No image providied.'));

        outputImage = new SimpleImage(inputImage.getWidth(), inputImage.getHeight());

        inputImage.values().forEach(pixel => {
            const x = pixel.getX();
            const y = pixel.getY();
            
            let newRed = getOutputValue(pixel.getRed());
            let newGreen = getOutputValue(pixel.getGreen());
            let newBlue = getOutputValue(pixel.getBlue());
            
            outputImage.getPixel(x, y).setRed(newRed);
            outputImage.getPixel(x, y).setGreen(newGreen);
            outputImage.getPixel(x, y).setBlue(newBlue);
        });

        resolve(outputImage);
    });
};

/**
 * Generate new image for the secret image
 */
const decodeSecret = async () => {
    try {
        outputImage = await extractSecret();

        // Show output canvas 
        const outputContainer = document.getElementById('output-row');
        outputContainer.style.display = "block";
    
        outputImage.drawTo(outputCanvas);
    } catch (error) {
        console.error(error.message);
    }
};