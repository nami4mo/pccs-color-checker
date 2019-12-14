const main = () => {
  const canvasColorPicker = new CanvasColorPicker();
  const pccsD3 = new PCCSd3Chart();
  canvasColorPicker.loadImage('./sample.jpg');
}

window.onload = main;