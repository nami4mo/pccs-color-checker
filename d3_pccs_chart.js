const SVG_WH = 360
const MAX_R = 45;


class PCCSd3Chart{
  constructor(colorManager){
    this.colorManager = colorManager;
    this.svg = d3.select("svg");
    this.colorInfoListDict = {};
    this.loadAndShowColor();
  }

  showAllTonePie(){
    const rowX = [SVG_WH*7/8, SVG_WH*5/8, SVG_WH*3/8, SVG_WH/8];

    this.showTonePie(this.colorInfoListDict.v, 'v', rowX[0], SVG_WH/2);

    this.showTonePie(this.colorInfoListDict.b, 'b', rowX[1], SVG_WH*1.5/6);
    this.showTonePie(this.colorInfoListDict.s, 's', rowX[1], SVG_WH*3/6);
    this.showTonePie(this.colorInfoListDict.dp, 'dp', rowX[1], SVG_WH*4.5/6);

    this.showTonePie(this.colorInfoListDict.ltP, 'ltP', rowX[2], SVG_WH/8);
    this.showTonePie(this.colorInfoListDict.sf, 'sf', rowX[2], SVG_WH*3/8);
    this.showTonePie(this.colorInfoListDict.d, 'd', rowX[2], SVG_WH*5/8);
    this.showTonePie(this.colorInfoListDict.dk, 'dk', rowX[2], SVG_WH*7/8);

    this.showTonePie(this.colorInfoListDict.pP, 'pP', rowX[3], SVG_WH/8);
    this.showTonePie(this.colorInfoListDict.ltg, 'ltg', rowX[3], SVG_WH*3/8);
    this.showTonePie(this.colorInfoListDict.g, 'g', rowX[3], SVG_WH*5/8);
    this.showTonePie(this.colorInfoListDict.dkg, 'dkg', rowX[3], SVG_WH*7/8);    

  }

  loadAndShowColor(){
    d3.csv("./color_info.csv", (data,i) => {
      if( !(data.tone_short in this.colorInfoListDict) ){
        this.colorInfoListDict[data.tone_short] = [];
      }
      this.colorInfoListDict[data.tone_short].push({
          hue_tone: data.hue_tone,rgb16: data.rgb16,
          value: 1
      });
    }).then((data) => {
      this.showAllTonePie();
    });
  }

  highlightColor(colorName){
    d3.select("#color-"+colorName)
    .attr("stroke", "black");
  }

  // thanks!
  // https://observablehq.com/@d3/donut-chart
  showTonePie(colorData, name, posX, posY){
    const rot = -90 - (360/colorData.length)/2;
  
    // TODO: sort by hue
    const pie = d3.pie()
      .sort(null)
      .value(d => d.value)
  
    const arcs = pie(colorData);
    
    const arc = d3.arc()
    .innerRadius(MAX_R/2)
    .outerRadius(MAX_R-2);

    this.svg.append("g")
    .attr("stroke", "white")
    .selectAll(".tone-"+name)
    .data(arcs)
    .join("path")
    .attr("class", "pccs-color tone-"+name)
    .attr("id", d => "color-"+d.data.hue_tone)
    .attr("fill", d => d.data.rgb16)
    .attr("d", arc)
    .attr("transform", (d,i) => {
        return `translate(${posX},${posY}) ` + `rotate(${rot}) ` + "scale(1.0,1.0)";  
    });

    this.svg.append("text")
    .text(name)
    .style("text-anchor", "middle")
    .style("dominant-baseline", "central")
    .attr("transform", `translate(${posX},${posY})`); 
  }

  // TODO: make this
  // change outerRadius calc
  changeTonePieSize(colorData, toneName){
    const pie = d3.pie()
    .sort(null)
    .value(d => d.value)

    const arcs = pie(colorData);

    const arc2 = d3.arc()
    .innerRadius(MAX_R/5)
    .outerRadius( (d) => {
      const r = Math.sqrt(d.data.count) * 4*MAX_R/5 + MAX_R/5 + 1;
      // if( r > MAX_R/5 ){
      //   return r + ;
      // }
      // else{
      //   return MAX_R/5 + 2;
      // }
      // const r = Math.sqrt(d.data.count) * MAX_R ;
      // if(r>10)console.log(r,d.data);
      return r;
    });

    d3.selectAll(".tone-"+toneName)
    .data(arcs)
    .transition()
    .duration(2000)
    .attr("d", arc2);
  }

  changeAllTonePieSize(eachToneColorCountData){
    for( const key in eachToneColorCountData){
      // console.log(eachToneColorCountData[key], key);
      this.changeTonePieSize(eachToneColorCountData[key], key);
    }
  }

}