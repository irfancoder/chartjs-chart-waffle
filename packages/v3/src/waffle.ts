function waffle(
  value = 90,
  {
    bind = null, // pass in a d3 selection i.e d3.select('class/div')
    shape = "circle", // 'circle' 'rect'
    activeFill = "#008cbc", // colour of the square or circle
    passiveFill = "#e5e7de", // when there is no value
    strokeCol = "#666666",
    shapeSize = 15,
    strokeWidth = 0,
    margin = {
      top: shapeSize,
      right: shapeSize,
      bottom: shapeSize,
      left: shapeSize,
    },
  } = {}
) {
  const size = (shapeSize + strokeWidth * 2) * 10;

  // append the svg if first render
  if (bind.select("svg").empty()) {
    bind
      .append("svg")
      .attr("width", size + margin.left + margin.right)
      .attr("height", size + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(grid10by10);
  }

  function grid10by10(sel) {
    const scaleX = d3
      .scaleLinear()
      .domain([0, 9])
      .range([0, shapeSize * 10]);

    const scaleY = d3
      .scaleLinear()
      .domain([0, 9])
      .range([shapeSize * 10, 0]);

    const render = sel
      .selectAll(shape)
      .data(d3.range(100))
      .join(shape)
      .attr("stroke-width", strokeWidth)
      .attr("stroke", strokeCol)
      // note < not <= as counting from 0
      .attr("fill", (d, i) => (i < value ? activeFill : passiveFill));

    if (shape === "rect") {
      render
        .attr("x", (d, i) => {
          const n = i % 10;
          return scaleX(n);
        })
        .attr("y", (d, i) => {
          const n = Math.floor(i / 10);
          return scaleY(n);
        })
        .attr("width", shapeSize)
        .attr("height", shapeSize);
    } else {
      render
        .attr("cx", (d, i) => {
          const n = i % 10;
          return scaleX(n);
        })
        .attr("cy", (d, i) => {
          const n = Math.floor(i / 10);
          return scaleY(n);
        })
        .attr("r", shapeSize / 2);
    }
  }

  return bind.select("svg g").call(grid10by10);
}
