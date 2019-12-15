class CanvasD3Controller{
  constructor(){
    this.colorManager = new ColorManager();
    this.pccsD3 = new PCCSd3Chart();
    this.canvasColorPicker = new CanvasColorPicker(this.colorManager);

    this.canvasColorPicker.loadImageFromFilename('./sample.jpg');
    this.canvasColorPicker.initCanvasOnClick(this.canvasOnClickCallback.bind(this));
    this.canvasColorPicker.initCanvasBtnOnClick(this.canvasBtnClickCallback.bind(this));
  }

  // click an image on canvas => get the nearest color Hue-Tone
  canvasOnClickCallback(hueTone){
    this.pccsD3.highlightColor(hueTone);
  }

  canvasBtnClickCallback(colorsCountDict){
    const colorNameListDict = this.colorManager.getToneToColorNameListDict();
    // console.log(colorNameListDict);
    const eachToneColorCountData = {};
    for( const key in colorNameListDict){
      eachToneColorCountData[key] = [];
      for( const colorName of colorNameListDict[key] ){
        eachToneColorCountData[key].push({value:1, count:colorsCountDict[colorName]});
      }
    }
    console.log(eachToneColorCountData);
    this.pccsD3.changeAllTonePieSize(eachToneColorCountData);
  }
  

}

const main = () => {
  const canvasD3Controller = new CanvasD3Controller();
}
window.onload = main;