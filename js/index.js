class CanvasD3Controller{
  constructor(){
    this.colorManager = new ColorManager();
    this.pccsD3 = new PCCSd3Chart();
    this.d3StackBar = new D3StackBar();
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
    console.log(colorNameListDict);
    const eachToneColorCountData = {};
    const eachHueColorCountData = {};
    let maxCount = 1;
    for( const key in colorNameListDict){
      if( colorNameListDict[key].length < 12 ){
        continue;
      }
      eachToneColorCountData[key] = [];
      for( const colorName of colorNameListDict[key] ){
        const count = colorsCountDict[colorName.hue_tone];
        if( count > maxCount && colorName.hue_tone.indexOf('Gy') < 0 ){
          maxCount = count;
        }
        eachToneColorCountData[key].push({value:1, count, colorName: colorName.hue_tone});
        if( !(colorName.hue in eachHueColorCountData) ){
          eachHueColorCountData[colorName.hue] = {};
        }
        eachHueColorCountData[colorName.hue][colorName.tone] = count;
      }
    }

    for( const key in eachToneColorCountData){
      for( let colorName of eachToneColorCountData[key] ){
        colorName.count /= maxCount;
      }
    }

    console.log(eachHueColorCountData);
    const eachHueColorCountDataList = [];
    for( const hue in eachHueColorCountData){
      const tmpDict = {};
      tmpDict.hue = hue;
      console.log(eachHueColorCountData[hue]);
      for( const tone in eachHueColorCountData[hue] ){
        tmpDict[tone] = eachHueColorCountData[hue][tone] / maxCount;
      }
      eachHueColorCountDataList.push(tmpDict);
    }

    console.log(eachToneColorCountData);
    this.pccsD3.changeAllTonePieSize(eachToneColorCountData);

    // console.log(eachHueColorCountDataList);
    // this.d3StackBar.showStackBar(eachHueColorCountDataList);
  }
  

}

const main = () => {
  const canvasD3Controller = new CanvasD3Controller();
}
window.onload = main;