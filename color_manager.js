class ColorManager{
  constructor(){
    this.colorInfoList;
    this.loadColorInfo();
  }

  // not perform well... 
  // 0 <= r,g,b <= 255 
  getNearestColorRGB(r,g,b){
    r /= 255;
    g /= 255;
    b /= 255;
    let currMinDist2 = 99999;
    let currNearestColorInfo;
    for( const color of this.colorInfoList ){
      const dist2 = (r-color.r)**2 + (g-color.g)**2 + (b-color.b)**2;
      
      if( dist2 < currMinDist2 ){
        currMinDist2 = dist2;
        currNearestColorInfo = color;
      }
    }
    return currNearestColorInfo;
  }

  // not perform well... 
  // 0 <= r,g,b <= 255 
  getNearestColorXYZ(r,g,b){
    r /= 255;
    g /= 255;
    b /= 255;
    let currMinDist2 = 99999;
    let currNearestColorInfo;
    for( const color of this.colorInfoList ){
      const [x, y, z] = this.RGBtoXYZ(r, g, b);
      const dist2 = (x-color.x)**2 + (y-color.y)**2 + (z-color.z)**2;
      if( dist2 < currMinDist2 ){
        currMinDist2 = dist2;
        currNearestColorInfo = color;
      }
    }
    return currNearestColorInfo;
  }

  // CIE76 (delta E76)
  // 0 <= r,g,b <= 255 
  getNearestColorLab(r,g,b){
    r /= 255;
    g /= 255;
    b /= 255;
    let currMinDist2 = 99999;
    let currNearestColorInfo;
    for( const color of this.colorInfoList ){
      const [x, y, z] = this.RGBtoXYZ(r, g, b);
      const [Lab_L, Lab_a, Lab_b] = this.XYZtoLab(x, y, z);
      const dist2 = (Lab_L-color.Lab_L)**2 + (Lab_a-color.Lab_a)**2 + (Lab_b-color.Lab_b)**2;
      if( dist2 < currMinDist2 ){
        currMinDist2 = dist2;
        currNearestColorInfo = color;
      }
    }
    return currNearestColorInfo;
  }

  loadColorInfo(){
    d3.csv("./color_info.csv", (data,i) => {
      const r = Number(data.r)/255;
      const g = Number(data.g)/255;
      const b = Number(data.b)/255;
      const [x, y, z] = this.RGBtoXYZ(r, g, b);
      const [Lab_L, Lab_a, Lab_b] = this.XYZtoLab(x, y, z);
      return {
        hue_tone: data.hue_tone, tone: data.tone_short,
        r, g, b, x, y, z, Lab_L, Lab_a, Lab_b
      };
    }).then((data) => {
      console.log(data);
      this.colorInfoList = data;
    });
  }

  RGBtoXYZ(r, g, b){
    const x = (0.4124*r) + (0.3576*g) + (0.1805*b);
    const y = (0.2126*r) + (0.7152*g) + (0.0722*b);
    const z = (0.0193*r) + (0.1192*g) + (0.9505*b);
    return [x,y,z]
  }

  // https://qiita.com/hachisukansw/items/09caabe6bec46a2a0858
  XYZtoLab(x, y, z){
    x *= 100;
    y *= 100;
    z *= 100;

    x /= 95.047;
    y /= 100;
    z /= 108.883;

    x = x > 0.008856 ? Math.pow(x, 1 / 3) : (7.787 * x) + (4 / 29);
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : (7.787 * y) + (4 / 29);
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : (7.787 * z) + (4 / 29);

    const L = (116 * y) - 16;
    const a = 500 * (x - y);
    const b = 200 * (y - z);

    return [L, a, b];
  }

}