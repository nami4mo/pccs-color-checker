const SVG_WH = 360
const MAX_R = 45;


class PCCSd3Chart{
  constructor(){
    this.svg = d3.select("svg");
    this.colorInfoListDict = {};
    this.loadAndShowColor();
    this.setCopyButton();
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

  setCopyButton(){
    document.getElementById("copy-btn").addEventListener("click", () => {
      const colorValue = document.getElementById("color-value").textContent;
      const textarea = document.createElement("textarea");
      document.body.appendChild(textarea) 
      textarea.textContent = colorValue;
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    });
  }

  loadAndShowColor(){
    d3.csv("./data/colors.csv", (data,i) => {
      if( !(data.tone_short in this.colorInfoListDict) ){
        this.colorInfoListDict[data.tone_short] = [];
      }
      this.colorInfoListDict[data.tone_short].push({
          hue_tone: data.hue_tone,rgb16: data.rgb16,
          value: 1, count:1
      });
    }).then((data) => {
      this.showAllTonePie();
    });
  }


  highlightColor(colorName){
    if( colorName.indexOf("Gy") >= 0 ){
      return;
    }

    const arc = d3.arc()
    .innerRadius(MAX_R/6)
    .outerRadius(MAX_R);

    const arc2 = d3.arc()
    .innerRadius(MAX_R/2)
    .outerRadius(MAX_R/1.5);

    const arc3 = d3.arc()
    .innerRadius(MAX_R/6)
    .outerRadius(MAX_R);

    const arc4 = d3.arc()
    .innerRadius(MAX_R/3-3)
    .outerRadius( (d) => {
      const r = Math.sqrt(d.data.count) * 2*MAX_R/3 + MAX_R/3 - 2;
      return r;
    });


    d3.select("#color-"+colorName)
    // .attr("stroke", "black")
    .transition()
    .duration(200)
    .attr("d", arc)
    .transition()
    .duration(500)
    .attr("d", arc2)
    .transition()
    .duration(200)
    .attr("d", arc3)
    .transition()
    .duration(500)
    .attr("d", arc4);
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
    .innerRadius(MAX_R/3-3)
    .outerRadius(MAX_R/3-2);

    const arc2 = d3.arc()
    .innerRadius(MAX_R/3-3)
    .outerRadius( (d) => {
      const r = Math.sqrt(d.data.count) * 2*MAX_R/3 + MAX_R/3 - 2;
      return r;
    });

    this.svg.append("text")
    .text(name)
    .style("text-anchor", "middle")
    .style("dominant-baseline", "central")
    .attr("transform", `translate(${posX},${posY})`); 

    this.svg.append("g")
    .attr("stroke", "white")
    .selectAll(".tone-"+name)
    .data(arcs)
    .join("path")
    .attr("class", "pccs-color tone-"+name)
    .attr("id", d => "color-"+d.data.hue_tone)
    .attr("fill", d => d.data.rgb16)
    .attr("d", arc)
    .on("click", (d) => {
      const rgb16 = d.data.rgb16;
      const colorValueDiv = document.getElementById("color-value");
      colorValueDiv.textContent = rgb16;
      colorValueDiv.style.border = `2px solid ${rgb16}`;
      
    })
    .attr("transform", (d,i) => {
      return `translate(${posX},${posY}) ` + `rotate(0) ` + "scale(1.0,1.0)";  
    })
    .transition()
    .duration(750)
    .attr("d", arc2)
    .attr("transform", (d,i) => {
      return `translate(${posX},${posY}) ` + `rotate(${rot}) ` + "scale(1.0,1.0)";  
    });

  }

  // TODO: make this
  // change outerRadius calc
  changeTonePieSize(colorData, toneName){
    const pie = d3.pie()
    .sort(null)
    .value(d => d.value)

    const arcs = pie(colorData);

    const arc2 = d3.arc()
    .innerRadius(MAX_R/3-3)
    .outerRadius( (d) => {
      const r = Math.sqrt(d.data.count) * 2*MAX_R/3 + MAX_R/3 -2;
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