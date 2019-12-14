class CanvasD3Controller{
  constructor(){
    this.colorManager = new ColorManager();
    this.pccsD3 = new PCCSd3Chart();
    this.canvasColorPicker = new CanvasColorPicker(this.colorManager);

    this.canvasColorPicker.loadImageFromFilename('./sample.jpg');
    this.canvasColorPicker.initPicker(this.canvasOnClick.bind(this));
  }

  // click an image on canvas => get the nearest color Hue-Tone
  canvasOnClick(hueTone){
    this.pccsD3.highlightColor(hueTone);
  }

}

const main = () => {
  const canvasD3Controller = new CanvasD3Controller();
}
window.onload = main;