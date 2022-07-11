let inputImage = null;
let coverImage = null;

/**
 * Load canvas on html body load
 */
function loadCanvases() {
    const inputCanvas = document.getElementById('input-canvas');
    const coverCanvas = document.getElementById('cover-canvas');
    const outputCanvas = document.getElementById('output-canvas');
    
    const inputCtx = inputCanvas.getContext('2d');
    const coverCtx = coverCanvas.getContext('2d');
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
}

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

    if (input === "input-image") {
        inputImage = simpleImage;
    } else {
        coverImage = simpleImage;
    }

    simpleImage.drawTo(cnvs);
}

/**
 * Calculate resulting pixel from input image and cover image
 * 
 * @param {int} x Input image pixel value
 * @param {int} y Cover image pixel value
 * 
 * @return {int}
 */
const calculatePixel = (x, y) => {
    // Combines the first 4 bits of y and the last 4 bits of x
    // to create another 0-255 number 
    return Math.floor(y/16)*16+Math.floor(x/16);
}

/**
 * Generate new pixels for output image
 * 
 * @param {Object} outputImage Output image object
 * 
 * @return {Object} Finished output image object
 */
async function generatePixels(outputImage) {
    return new Promise(function (resolve, reject) {
        if (outputImage == null) {
            reject(new Error('No output image provided.'));
            return;
        }

        let x, y, red, green, blue;

        inputImage.values().forEach(pixel => {
            x = pixel.getX();
            y = pixel.getY();
            coverPixel = coverImage.getPixel(x, y);
            
            let outputPixel = outputImage.getPixel(x, y);

            red = calculatePixel(pixel.getRed(), coverPixel.getRed());
            green = calculatePixel(pixel.getGreen(), coverPixel.getGreen());
            blue = calculatePixel(pixel.getBlue(), coverPixel.getBlue());

            // Generate new image with the calculated pixels 
            outputPixel.setRed(red);
            outputPixel.setGreen(green);
            outputPixel.setBlue(blue);
        });

        resolve(outputImage);
    });
}

/**
 * Generate secret image 
 */
async function createSecretImage() {
    let outputCanvas = document.getElementById('output-canvas');
    let outputImage = new SimpleImage(coverImage);

    try {
        let response = await generatePixels(outputImage);
        response.drawTo(outputCanvas);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }

    console.log('Done.');
}