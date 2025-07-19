//--DEFAULT SETTINGS--//
const config = {
    mode: 'capped', // capped|full
    results: 10,
    values: true,
    debug: false
};

//--DOM NODE REFERENCES--//
const buttonInput = document.querySelector('button#input');
const uploadInput = document.querySelector('input#upload');
const outputCanvas = document.querySelector('canvas#output');
const outputCanvasContext = outputCanvas.getContext('2d');
const thresholdInput = document.querySelector('input#threshold');
const messageDiv = document.querySelector('div#message');

//--DOM FUNCTIONS--//
function onKeyDown() {
	
}

//--EVENT HANDLERS--//


//--FUNCTIONS--//
function processImage(img) {
    // Resize for performance
    let maxSize = 200;
    let scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
    outputCanvas.width = img.width * scale;
    outputCanvas.height = img.height * scale;
    outputCanvasContext.drawImage(img, 0, 0, outputCanvas.width, outputCanvas.height);

    let imageData = outputCanvasContext.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    let data = imageData.data;

    let colorCounts = {};
    for (let i = 0; i < data.length; i += 4) {
        let r = Math.round(data[i] / 32) * 32;
        let g = Math.round(data[i + 1] / 32) * 32;
        let b = Math.round(data[i + 2] / 32) * 32;
        let name = config.debug ? rgbToHsl(r,g,b) : classifyColor(r, g, b);
        colorCounts[name] = (colorCounts[name] || 0) + 1;
    }

    let values = Array.from(Object.values(colorCounts));
    let threshold = typeof parseInt(thresholdInput.value) == 'number' ? parseInt(thresholdInput.value) : 0;
    //console.log(Math.max(...values));
    let sortedColors = Object.entries(colorCounts)
        .filter(f => config.mode == 'capped' ? f[1] > threshold / 100 * Math.max(...values) : true)
        .sort((a, b) => b[1] - a[1])
        .slice(0, config.results);
    if(sortedColors.length < 3) {
        console.log('remove max results');
        sortedColors = Object.entries(colorCounts)
        .filter(f => config.mode == 'capped' ? f[1] > threshold / 100 * Math.max(...values) : true)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
    }
    if(config.results >= 3 && sortedColors.length < 3) {
        console.log('remove threshold');
        sortedColors = Object.entries(colorCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
    }

    messageDiv.innerText = 'Top Colors:\n\n' + sortedColors.map(c => c[0][0].toUpperCase() + c[0].slice(1) + (config.values ? ' (' + c[1] + ')' : '')).join('\n');
}

//---HSL CLASSIFIER---//
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = ((b - r) / d + 2); break;
      case b: h = ((r - g) / d + 4); break;
    }
    h /= 6;
  }
  return [parseFloat(h * 360).toFixed(2), parseFloat(s).toFixed(2), parseFloat(l).toFixed(2)];
}

function classifyColor(r, g, b) {
  const [h, s, l] = rgbToHsl(r, g, b);

  // achromatic or low saturation: treat as black
  if (l < 0.12 || s < 0.12) return "black";
  if (l > 0.92 && s < 0.1) return "white";

  // beige (light yellow range) for skin tones
  if (h >= 35 && h <= 55 && l > 0.6) return "beige";

  if (h < 15 || h >= 345) return "red";
  if (h < 45) return "orange";
  if (h < 65) return "yellow";
  if (h < 170) return "green";
  if (h < 200) return "cyan";
  if (h < 255) return "blue";
  if (h < 290) return "purple";
  if (h < 345) return "pink";
  return "unknown";
}

//--INITIAL--//
function startup() {
    buttonInput.addEventListener('click', function (e) {
        uploadInput.click();
    });
    uploadInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file) return;

        const img = new Image();
        img.onload = () => processImage(img);
        img.src = URL.createObjectURL(file);
    });
}
