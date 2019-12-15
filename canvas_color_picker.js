const CANVAS_W = 350
const CANVAS_H = 350

class CanvasColorPicker{
  constructor(colorManager){
    this.canvas = document.getElementById("img-canvas");
    this.canvas.width = CANVAS_W;
    this.canvas.height = CANVAS_W;
    this.context = this.canvas.getContext('2d');
    this.canvasBtn = document.getElementById("canvas-btn");

    this.colorCountList = [];
    this.colorCountDict = {};


    this.colorManager = colorManager;
    this.initImageDragDropLoader();
  }

  loadImageFromFilename(imageName){
    const img = new Image();
    img.src = imageName;
    img.onload = () => {
      this.loadImage(img);
    }
  }

  loadImage(img){
    this.context.clearRect(0, 0, CANVAS_W, CANVAS_H);
    const ratioWH = img.width / img.height;
    if( ratioWH > 1.0 ){
      this.context.drawImage(img, 0, (CANVAS_H-CANVAS_W/ratioWH)/2, CANVAS_W, CANVAS_W / ratioWH);
      this.checkColorCount(0, (CANVAS_H-CANVAS_W/ratioWH)/2, CANVAS_W, CANVAS_W / ratioWH);
    }
    else{
      this.context.drawImage(img, (CANVAS_W-CANVAS_H*ratioWH)/2, 0, CANVAS_H * ratioWH, CANVAS_H);
      this.checkColorCount((CANVAS_W-CANVAS_H*ratioWH)/2, 0, CANVAS_H * ratioWH, CANVAS_H);
    } 
  }

  checkColorCount(sX, sY, width, height){
    sX = parseInt(sX);
    sY = parseInt(sY);
    width = parseInt(width);
    height = parseInt(height);
    const imagedata = this.context.getImageData(sX, sY, width, height);
    this.colorCountDict = {};
    const allColorName = this.colorManager.getAllColorName();
    for( const color of allColorName ){
      this.colorCountDict[color] = 0;
    }
    for( let i = 0 ; i < width*height ; i++ ){
      const [r,g,b] = imagedata.data.slice(i*4,i*4+3);
      const nearestColor = this.colorManager.getNearestColorLab(r,g,b).hue_tone;
      // if( !(nearestColor in this.colorCountDict) ){
      //   this.colorCountDict[nearestColor] = 0;
      // }
      this.colorCountDict[nearestColor] += 1;
    }

    this.colorCountList = [];
    for( const key in this.colorCountDict ){
      this.colorCountList.push( {hue_tone: key, count: this.colorCountDict[key] } );
    }
    this.colorCountList.sort(function(a,b){
      if(a.count > b.count) return -1;
      if(a.count < b.count) return 1;
      return 0;
    });
    console.log(this.colorCountList);
  }

  initCanvasOnClick(callback){
    this.canvas.onclick = (e) => {
      const x = e.offsetX;
      const y = e.offsetY;  
      const imagedata = this.context.getImageData(x, y, 1, 1);
      const [r,g,b,a, ...other] = imagedata.data;

      // const nearestColor = this.colorManager.getNearestColorRGB(r,g,b,a);
      // const nearestColor = this.colorManager.getNearestColorXYZ(r,g,b,a);
      const nearestColor = this.colorManager.getNearestColorLab(r,g,b);
      console.log('Lab', nearestColor);
      console.log(nearestColor.hue_tone);
      console.log(r,g,b);
      callback(nearestColor.hue_tone)
    }
  }

  initCanvasBtnOnClick(callback){
    this.canvasBtn.onclick = (e) => {
      // callback(this.colorCountList);
      callback(this.colorCountDict);
    }
  }

  initImageDragDropLoader(){
    this.canvas.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
      this.canvas.classList.add('drag');
    });

    this.canvas.addEventListener('dragleave', (e) => {
      this.canvas.classList.remove('drag');
    });

    this.canvas.addEventListener('drop', (e) => {
      this.canvas.classList.remove('drag');
      e.stopPropagation();
      e.preventDefault();
      const image = new Image();
      const reader = new FileReader();
      reader.onload = (event) => {
        image.onload = () => {
          this.loadImage(image);
        }
        image.src = event.target.result;
      }
      reader.readAsDataURL(e.dataTransfer.files[0]);
    });
  }
}
