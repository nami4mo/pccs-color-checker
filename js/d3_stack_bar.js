const STACK_SVG_WH = 360
const toneList = ['v', 'b', 's', 'dp', 'ltP', 'sf', 'd', 'dk', 'pP', 'ltg', 'g', 'dkg'];

class D3StackBar{
  constructor(colorManager){
    this.colorManager = colorManager;
    this.svg = d3.select("svg");
  }

  showStackBar(eachHueCountList){
    const xScale = d3.scaleLinear()
    .domain([0, 12])
    .range([0, STACK_SVG_WH]);
 
    const yScale = d3.scaleLinear()
    .domain([0,
      d3.max(eachHueCountList, function(d) {
        let sum = 0;
        for( const tone of toneList){
          sum += d[tone];
        }
        return sum;
      })
    ])
    .range([0, STACK_SVG_WH]);

    const stack = d3.stack()
    .keys(toneList);
 
    const series = stack(eachHueCountList);

    this.svg.append("g")
    .selectAll("g")
    .data(series)
    .join("g")
    .attr("fill", (d,i,j) => {console.log(d.key);  return '#222';})
    .selectAll("rect")
    .data(d => d)
    .join("rect")
    .attr("x", (d, i) => {console.log(i,xScale(i));  return xScale(i);})
    .attr("y", d => yScale(0))
    .attr("height", d => yScale(d[1]) - yScale(d[0]))
    .attr("width", 10);
  }
}