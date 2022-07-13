const inputCanvas = document.getElementById('input-canvas');
const inputCtx = inputCanvas.getContext('2d');

// const outputCanvas = document.getElementById('output-canvas');
// const outputCtx = outputCanvas.getContext('2d');

inputCtx.fillStyle = 'black';
inputCtx.font = '1em sans-serif';
inputCtx.textBaseline = 'middle';
inputCtx.textAlign = 'center';
inputCtx.fillText('Input Image', 150, 70);

// outputCtx.fillStyle = 'black';
// outputCtx.font = '1em sans-serif';
// outputCtx.textBaseline = 'middle';
// outputCtx.textAlign = 'center';
// outputCtx.fillText('Output Image', 150, 70);

let inputImage = null;

const decodeSecret = () => {
    alert("Decoding...");
};