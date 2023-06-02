// ************************** ridgeplot **************************
// svg_rdige = RidgeLine(ffill3(data), {
//   marginTop: 20, // top margin, in pixels
//   marginRight: 20, // right margin, in pixels
//   marginBottom: 60, // bottom margin, in pixels
//   marginLeft: 60, // left margin, in pixels
//   width: 900,
//   height: 450,
// });
// const div_ridgechart = d3.select("#div_ridgechart").text("");
// div_ridgechart.node().appendChild(svg_rdige);

// ************************** slider **************************

// d3.select("#mySlider2").on("change", function (d) {
//   selectedValue = this.value;
//   // update stackedarea chart
//   svg_stack = StackedAreaChart(ffill3(data, selectedValue), {
//     x: (d) => d.abs_time,
//     y: (d) => d.value,
//     z: (d) => d.mod,
//     yLabel: "↑ Unemployed persons",
//     marginTop: 20, // top margin, in pixels
//     marginRight: 20, // right margin, in pixels
//     marginBottom: 60, // bottom margin, in pixels
//     marginLeft: 60, // left margin, in pixels
//     width: 900,
//     height: 450,
//     rect_dim: rect_dim,
//     xType: d3.scaleLinear,
//   });
//   const div_stackedchart = d3.select("#stackedchart").text("");
//   div_stackedchart.node().appendChild(svg_stack);
// });

// ************************** stacked Bar chart **************************

// dd2 = ffill3(data);

// let groupedByAge = d3.group(dd2, (d) => d.abs_time);

// const arrayOfObjects = [];

// groupedByAge.forEach((values, key) => {
//   const groupObject = {};

//   for (let value of values) {
//     //console.log(value)
//     groupObject[value["mod"]] = value["value"];
//   }

//   groupObject["abs_time"] = key;

//   arrayOfObjects.push(groupObject);
// });

// arrayOfObjects.columns = Object.keys(arrayOfObjects[0]);

// console.log(
//   "arrayOfObjects",
//   arrayOfObjects,
//   arrayOfObjects.columns.slice(0, -1)
// );

// modalities = arrayOfObjects.columns.slice(0, -1);

// dd2.map((d) => {
//   d.abs_time = d.abs_time.toString();
//   d.value = +d.value;
//   d.mod = d.mod.toString();
// });
// console.log("stateages", dd2);
// svg_stackBarChart = StackedBarChart(dd2, {
//   x: (d) => d.abs_time, // x axis
//   y: (d) => d.value, // values,
//   z: (d) => d.mod, // modalities
//   yLabel: "↑ Population (millions)",
//   zDomain: modalities,
//   colors: d3.schemeSpectral[modalities.length],
//   width: 900,
//   height: 450,
// });
// const div_stackedBarChart = d3.select("#stackedBarChart").text("");
// div_stackedBarChart.node().appendChild(svg_stackBarChart);

function render_stackedBar(
  data,
  {
    x = (d, i) => i, // given d in data, returns the (ordinal) x-value
    y = (d) => d, // given d in data, returns the (quantitative) y-value
    z = () => 1, // given d in data, returns the (categorical) z-value
    title, // given d in data, returns the title text
    marginTop = 30, // top margin, in pixels
    marginRight = 0, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    xDomain, // array of x-values
    xRange = [marginLeft, width - marginRight], // [left, right]
    xPadding = 0.1, // amount of x-range to reserve to separate bars
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    zDomain, // array of z-values
    offset = d3.stackOffsetDiverging, // stack offset method
    order = d3.stackOrderNone, // stack order method
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    colors = d3.schemeTableau10, // array of colors
  } = {}
) {
  // Copyright 2021 Observable, Inc.
  // Released under the ISC license.
  // https://observablehq.com/@d3/stacked-bar-chart
  // with modifications by our group
  const rect_width = 10;
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);
  console.log("X", X, "Y", Y, "Z", Z);
  // Compute default x- and z-domains, and unique them.
  if (xDomain === undefined) xDomain = X;
  if (zDomain === undefined) zDomain = Z;
  xDomain = new d3.InternSet(xDomain);
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the x- and z-domains.
  const I = d3
    .range(X.length)
    .filter((i) => xDomain.has(X[i]) && zDomain.has(Z[i]));

  // Compute a nested array of series where each series is [[y1, y2], [y1, y2],
  // [y1, y2], …] representing the y-extent of each stacked rect. In addition,
  // each tuple has an i (index) property so that we can refer back to the
  // original data point (data[i]). This code assumes that there is only one
  // data point for a given unique x- and z-value.
  const series = d3
    .stack()
    .keys(zDomain)
    .value(([x, I], z) => Y[I.get(z)])
    .order(order)
    .offset(offset)(
      d3.rollup(
        I,
        ([i]) => i,
        (i) => X[i],
        (i) => Z[i]
      )
    )
    .map((s) => s.map((d) => Object.assign(d, { i: d.data[1].get(s.key) })));
  console.log("series", series);

  // Compute the default y-domain. Note: diverging stacks can be negative.
  if (yDomain === undefined) yDomain = d3.extent(series.flat(2));

  // Construct scales, axes, and formats.
  xRange = [0, width];
  yRange = [height, 0];
  // const xScale = d3.scaleBand(xDomain, xRange).paddingInner(xPadding);
  const xScale = d3.scaleLinear(
    [d3.min(X.map((d) => +d)) - 5, d3.max(X.map((d) => +d)) + 5],
    xRange
  );
  console.log("xScale", [
    d3.min(X.map((d) => +d)) - 5,
    d3.max(X.map((d) => +d)) + 5,
  ]);
  const yScale = yType(yDomain, yRange);
  const color = d3.scaleOrdinal(zDomain, colors);
  console.log("wtf", zDomain, colors);
  const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 60, yFormat);

  // Compute titles.
  if (title === undefined) {
    const formatValue = yScale.tickFormat(100, yFormat);
    title = (i) => `${X[i]}\n${Z[i]}\n${formatValue(Y[i])}`;
  } else {
    const O = d3.map(data, (d) => d);
    const T = title;
    title = (i) => T(O[i], i, data);
  }

  const svg_holder = d3
    .create("svg")
    .attr("width", width + marginLeft + marginRight)
    .attr("height", height + marginTop + marginBottom);
  // .attr("viewBox", [0, 0, width, height])
  // .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  stackedchart = svg_holder
    .append("g")
    .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

  stackedchart
    .append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(yAxis)
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .selectAll(".tick line")
        .clone()
        .attr("x2", width - marginLeft - marginRight)
        .attr("stroke-opacity", 0.1)
    )
    .call((g) =>
      g
        .append("text")
        .attr("x", -marginLeft)
        .attr("y", 10)
        .attr("fill", "currentColor")
        .attr("text-anchor", "start")
        .text(yLabel)
    );

  console.log("series", series);
  const bar = stackedchart
    .append("g")
    .selectAll("g")
    .data(series)
    .join("g")
    .attr("fill", ([{ i }]) => color(Z[i]))
    .selectAll("rect")
    .data((d) => d)
    .join("rect")
    .attr("x", ({ i }) => xScale(X[i]))
    .attr("y", ([y1, y2]) => Math.min(yScale(y1), yScale(y2)))
    .attr("height", ([y1, y2]) => Math.abs(yScale(y1) - yScale(y2)))
    .attr("width", rect_width);
  // .attr("width", xScale.bandwidth());

  if (title) bar.append("title").text(({ i }) => title(i));

  stackedchart
    .append("g")
    .attr("transform", `translate(0,${yScale(0)})`)
    .call(xAxis);

  svg_holder.attr("id", "stackedbarchart_svg");

  return Object.assign(svg_holder.node(), { scales: { color } });
}

function RidgeLine(
  data_pre,
  {
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    overlap = 8,
  }
) {
  // preprocess data
  console.log("RidgeLine", data_pre);

  ff = (data) => {
    const dates = Array.from(d3.group(data, (d) => +d.abs_time).keys()).sort(
      d3.ascending
    );
    console.log("RidgeLine dates", dates);

    return {
      dates: dates.map((d) => d),
      series: d3
        .groups(data_pre, (d) => d.mod)
        .map(([name, values]) => {
          const value = new Map(values.map((d) => [+d.abs_time, d.value]));
          return { name, values: dates.map((d) => value.get(d)) };
        }),
    };
  };

  data = ff(data_pre);
  height = data.series.length * 17;
  console.log("RidgeLine2", data);

  const X = d3.map(data_pre, (d) => d.abs_time);
  const Y = d3.map(data_pre, (d) => d.mod);
  const Z = d3.map(data_pre, (d) => d.value);

  xScale = d3
    .scaleLinear()
    .domain([d3.min(X) - 5, d3.max(X) + 5])
    .range([0, width]);
  yScale = d3
    .scalePoint()
    .domain(data.series.map((d) => d.mod))
    .range([0, height]);
  zScale = d3
    .scaleLinear()
    .domain([0, d3.max(data.series, (d) => d3.max(d.values))])
    .nice()
    .range([0, -overlap * yScale.step()]);

  xAxis = (g) =>
    g.attr("transform", `translate(0,${height})`).call(
      d3
        .axisBottom(xScale)
        .ticks(width / 80)
        .tickSizeOuter(0)
    );

  yAxis = (g) =>
    g
      .attr("transform", `translate(${marginLeft * 0},0)`)
      .call(d3.axisLeft(yScale).tickSize(0).tickPadding(4))
      .call((g) => g.select(".domain").remove());

  area = d3
    .area()
    .curve(d3.curveBasis)
    .defined((d) => !isNaN(d))
    .x((d, i) => xScale(data.dates[i]))
    .y0(0)
    .y1((d) => zScale(d));

  line = area.lineY1();

  // start plotting

  const svg_holder = d3
    .create("svg")
    .attr("width", width + marginLeft + marginRight)
    .attr("height", height + marginTop + marginBottom);

  ridgeChart = svg_holder
    .append("g")
    .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

  // const svg = d3.select(DOM.svg(width, height));

  ridgeChart.append("g").call(xAxis);

  ridgeChart.append("g").call(yAxis);

  const group = ridgeChart
    .append("g")
    .selectAll("g")
    .data(data.series)
    .join("g")
    .attr("transform", (d) => `translate(0,${yScale(d.mod) + 1})`);

  group
    .append("path")
    .attr("fill", "#ddd")
    .attr("d", (d) => area(d.values));

  group
    .append("path")
    .attr("fill", "none")
    .attr("stroke", "black")
    .attr("d", (d) => line(d.values));

  return svg_holder.node();
}
