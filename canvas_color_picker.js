const CANVAS_W = 500
const CANVAS_H = 500

class CanvasColorPicker{
  constructor(colorManager){
    this.canvas = document.getElementById("img-canvas");
    this.canvas.width = CANVAS_W;
    this.canvas.height = CANVAS_W;
    this.context = this.canvas.getContext('2d');

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
    }
    else{
      this.context.drawImage(img, (CANVAS_W-CANVAS_H*ratioWH)/2, 0, CANVAS_H * ratioWH, CANVAS_H);
    }  
  }

  initPicker(callback){
    this.canvas.onclick = (e) => {
      const x = e.offsetX;
      const y = e.offsetY;  
      const imagedata = this.context.getImageData(x, y, 1, 1);
      const [r,g,b,a, ...other] = imagedata.data;

      // const nearestColor = this.colorManager.getNearestColorRGB(r,g,b,a);
      // const nearestColor = this.colorManager.getNearestColorXYZ(r,g,b,a);
      const nearestColor = this.colorManager.getNearestColorLab(r,g,b,a);
      console.log('Lab', nearestColor);
      console.log(nearestColor.hue_tone);
      console.log(r,g,b);
      callback(nearestColor.hue_tone)
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
