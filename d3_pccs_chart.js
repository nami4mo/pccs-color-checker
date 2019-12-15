class PCCSd3Chart{
  constructor(colorManager){
    this.colorManager = colorManager;
    this.svg = d3.select("svg");
    this.colorInfoListDict = {};
    this.loadAndShowColor();
  }

  showAllTonePie(){
    this.showTonePie(this.colorInfoListDict.v, 'v', 400, 250);

    this.showTonePie(this.colorInfoListDict.b, 'b', 300, 150);
    this.showTonePie(this.colorInfoListDict.s, 's', 300, 250);
    this.showTonePie(this.colorInfoListDict.dp, 'dp', 300, 350);

    this.showTonePie(this.colorInfoListDict.ltP, 'ltP', 200, 100);
    this.showTonePie(this.colorInfoListDict.sf, 'sf', 200, 200);
    this.showTonePie(this.colorInfoListDict.d, 'd', 200, 300);
    this.showTonePie(this.colorInfoListDict.dk, 'dk', 200, 400);

    this.showTonePie(this.colorInfoListDict.pP, 'pP', 100, 100);
    this.showTonePie(this.colorInfoListDict.ltg, 'ltg', 100, 200);
    this.showTonePie(this.colorInfoListDict.g, 'g', 100, 300);
    this.showTonePie(this.colorInfoListDict.dkg, 'dkg', 100, 400);    

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
    const width = 100;
    const height = 100;
    const rot = -90 - (360/colorData.length)/2;
  
    // TODO: sort by hue
    const pie = d3.pie()
      .sort(null)
      .value(d => d.value)
  
    const arcs = pie(colorData);
    
    const arc = d3.arc()
    .innerRadius(width/4)
    .outerRadius(width/2.1);

    // const arc2 = d3.arc()
    // .innerRadius(width/4)
    // .outerRadius( (d,i) => {
    //   if( i%3 == 0){
    //     return width/1.5;
    //   }
    //   else{
    //     return width/2.1;
    //   }
    // });
  
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

  
    // d3.selectAll(".tone-"+name)
    // .data(arcs)
    // .transition()
    // .duration(2000)
    // .attr("d", arc2);
    
    // d3.select("#color-"+name)
    // .data(arcs)
    // .transition()
    // .duration(2000)
    // .attr("d", arc2);

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
    .innerRadius(100/4)
    .outerRadius( (d,i) => {
      if( d.data.count/10 > 300 ){
        return 300;
      }
      return d.data.count/10;
    });

    d3.selectAll(".tone-"+toneName)
    .data(arcs)
    .transition()
    .duration(2000)
    .attr("d", arc2);
  }

  changeAllTonePieSize(eachToneColorCountData){
    for( const key in eachToneColorCountData){
      console.log(eachToneColorCountData[key], key);
      this.changeTonePieSize(eachToneColorCountData[key], key);
    }
  }

}