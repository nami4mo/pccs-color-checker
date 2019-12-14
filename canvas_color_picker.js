class CanvasColorPicker{
  constructor(){
    this.initPicker();
    this.colorManager = new ColorManager();
  }

  loadImage(image_name){
    const canvas = document.getElementById("img-canvas");
    const context = canvas.getContext('2d');
   
    const img = new Image();
    img.src = image_name;
   
    img.onload = () => {
      context.drawImage(img, 0, 0, 400, 300);
    }
  }

  initPicker(){
    const canvas = document.getElementById("img-canvas");
    const context = canvas.getContext('2d');
    canvas.onclick = (e) => {
      const x = e.offsetX;
      const y = e.offsetY;  
      const imagedata = context.getImageData(x, y, 1, 1);
      const [r,g,b,a, ...other] = imagedata.data;

      // const nearestColor = this.colorManager.getNearestColorRGB(r,g,b,a);
      // const nearestColor = this.colorManager.getNearestColorXYZ(r,g,b,a);
      const nearestColor = this.colorManager.getNearestColorLab(r,g,b,a);
      console.log('Lab', nearestColor);
    }
  }
}
