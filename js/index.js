class CanvasD3Controller{
  constructor(){
    this.colorManager = new ColorManager();
    this.pccsD3 = new PCCSd3Chart();
    this.canvasColorPicker = new CanvasColorPicker(this.colorManager);

    // this.canvasColorPicker.loadImageFromFilename('./sample.jpg');
    this.canvasColorPicker.initCanvasOnClick(this.canvasOnClickCallback.bind(this));
    this.canvasColorPicker.initCanvasBtnOnClick(this.canvasBtnClickCallback.bind(this));
  }

  // click an image on canvas => get the nearest color Hue-Tone
  canvasOnClickCallback(hueTone){
    this.pccsD3.highlightColor(hueTone);
  }

  // ignore Gy colors
  canvasBtnClickCallback(colorsCountDict){
    console.log(colorsCountDict);
    if(Object.keys(colorsCountDict).length === 0){
      return;
    }
    const colorNameListDict = this.colorManager.getToneToColorNameListDict();
    const eachToneColorCountData = {};
    let maxCount = 1;
    for( const key in colorNameListDict){
      eachToneColorCountData[key] = [];
      for( const colorName of colorNameListDict[key] ){
        const count = colorsCountDict[colorName];
        if( count > maxCount && colorName.indexOf('Gy') < 0 ){
          maxCount = count;
        }
        eachToneColorCountData[key].push({value:1, count, colorName});
      }
    }

    for( const key in eachToneColorCountData){
      for( let colorName of eachToneColorCountData[key] ){
        colorName.count /= maxCount;
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