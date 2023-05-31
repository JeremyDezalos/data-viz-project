PATH = "../resources/sepsis1/core/transfers.csv";
PATH = "../resources/tsne_datavis.json";
PATH2 = "../resources/test.json";

var PAT_ID = 0; // patient id selected from tsne and to be displayed

function render_legend_tsne(colorScale) {
  console.log("rendering legend");
  const svg_holder = d3.select("#legend_tsne");
  var svg_tsne = d3.select("#tsne_legend");

  // Usually you have a color scale in your chart already
  var keys = ["Mister A", "Brigitte", "Eleonore", "Another friend", "Batman"];
  keys = colorScale.domain();
  console.log(keys);

  var color = d3.scaleOrdinal().domain(keys).range(d3.schemeSet2);

  // Add one dot in the legend for each name.
  svg_tsne
    .selectAll("mydots")
    .data(keys)
    .enter()
    .append("circle")
    .attr("cx", 100)
    .attr("cy", function (d, i) {
      return 100 + i * 25;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 7)
    .style("fill", function (d) {
      return colorScale(d);
    });

  // Add one label in the legend for each name.
  svg_tsne
    .selectAll("mylabels")
    .data(keys)
    .enter()
    .append("text")
    .attr("x", 120)
    .attr("y", function (d, i) {
      return 100 + i * 25;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", function (d) {
      return colorScale(d);
    })
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
}

// load tsne data points and render them
d3.json(PATH).then((data) => {
  console.log(data);
  render_scatterplot_tsne(data, "x", "y", "color");
});

// load the entire dataset (for all patients) and render them
function plot_states() {
  d3.json(PATH2)
    .then(function (data) {
      // step 1: return the data for the selected patient
      console.log(PAT_ID, data);

      return data[PAT_ID];
    })
    .then((data) => {
      // remove all the previous tooltips
      d3.selectAll(".tooltip-donut").remove();

      // remove the content of previous scatterplot
      d3.select("#scatterplot_states2").text("");

      // optional pre-processing: value => abs(value) - 1
      // const new_data = data.map((d) => {
      //   d.value =
      //     Math.abs(d.value) > 1
      //       ? (Math.abs(d.value) - 1) * Math.sign(d.value) * Math.sign(d.value)
      //       : 0;

      //   return d;
      // });

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

      // ************************** scatterplot **************************
      const rect_dim = 10; // dimension of the rectangles in pixels
      svg_scatter = render_scatterplot_states(
        data, // other options new_data,   ffill3(data) [imputed data],
        "abs_time",
        "mod",
        "value",
        (att = "att"),
        {
          marginTop: 20, // top margin, in pixels
          marginRight: 20, // right margin, in pixels
          marginBottom: 60, // bottom margin, in pixels
          marginLeft: 60, // left margin, in pixels
          width: 900,
          height: 450,
          rect_dim: rect_dim,
        }
      );
      console.log("svg_scatter", svg_scatter);
      const div_state_scatter = d3.select("#scatterplot_states_div").text("");
      div_state_scatter.node().appendChild(svg_scatter);

      // ************************** stacked area chart **************************
      svg_stack = StackedAreaChart(ffill3(data), {
        x: (d) => d.abs_time,
        y: (d) => d.value,
        z: (d) => d.mod,
        yLabel: "↑ Unemployed persons",
        marginTop: 20, // top margin, in pixels
        marginRight: 20, // right margin, in pixels
        marginBottom: 60, // bottom margin, in pixels
        marginLeft: 60, // left margin, in pixels
        width: 900,
        height: 450,
        rect_dim: rect_dim,
        xType: d3.scaleLinear,
      });
      console.log("svg_stack", svg_stack);
      const div_stackedchart = d3.select("#stackedchart").text("");
      div_stackedchart.node().appendChild(svg_stack);
    });
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

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/stacked-area-chart
function StackedAreaChart(
  data,
  {
    x = ([x]) => x, // given d in data, returns the (ordinal) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    z = () => 1, // given d in data, returns the (categorical) z-value
    marginTop = 20, // top margin, in pixels
    marginRight = 30, // right margin, in pixels
    marginBottom = 30, // bottom margin, in pixels
    marginLeft = 40, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    rect_dim = 10,
    xType = d3.scaleUtc, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    zDomain, // array of z-values
    offset = d3.stackOffsetDiverging, // stack offset method
    order = d3.stackOrderNone, // stack order method
    xFormat, // a format specifier string for the x-axis
    yFormat, // a format specifier for the y-axis
    yLabel, // a label for the y-axis
    colors = d3.schemeTableau10, // array of colors for z
  } = {}
) {
  console.log("HIIIIIIIIIIIIIIIII");
  // Compute values.
  data.forEach((d) => {
    d.value = d.value + 0.000001;
  });
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);
  console.log(X, Y, Z);

  // Compute default x- and z-domains, and unique the z-domain.
  if (xDomain === undefined) xDomain = [d3.min(X) - 5, d3.max(X) + 5];
  if (zDomain === undefined) zDomain = Z;
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the z-domain.
  const I = d3.range(X.length).filter((i) => zDomain.has(Z[i]));

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

  // Compute the default y-domain. Note: diverging stacks can be negative.
  if (yDomain === undefined) yDomain = d3.extent(series.flat(2));

  // Construct scales and axes.
  xRange = [0, width];
  yRange = [height, 0];
  const xScale = xType(xDomain, xRange);
  console.log("xScale", xScale, xDomain, xRange, typeof X[0]);
  const yScale = yType(yDomain, yRange);
  const color = d3.scaleOrdinal(zDomain, colors);
  const xAxis = d3.axisBottom(xScale);
  // .ticks(width / 80, xFormat);
  // .tickSizeOuter(0)
  const yAxis = d3.axisLeft(yScale).ticks(height / 50, yFormat);
  const area = d3
    .area()
    .x(({ i }) => xScale(X[i]))
    .y0(([y1]) => yScale(y1))
    .y1(([, y2]) => yScale(y2));

  const svg_hoder = d3
    .create("svg")
    .attr("width", width + marginLeft + marginRight)
    .attr("height", height + marginTop + marginBottom);
  // .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
  // .attr("viewBox", [0, 0, width, height])

  stackedchart = svg_hoder
    .append("g")
    .attr("transform", "translate(" + marginLeft + "," + marginTop + ")");

  stackedchart
    .append("g")
    .attr("class", "y-axis")
    .call(yAxis)
    .call((g) => g.select(".domain").remove())
    .call((g) =>
      g
        .selectAll(".tick line")
        .clone()
        .attr("x2", width)
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

  stackedchart
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);

  g_zoomable = stackedchart.append("g").attr("id", "stack_zoomable");

  // adding area
  area_g = g_zoomable
    .append("g")
    .selectAll("path")
    .data(series)
    .join("path")
    .attr("fill", ([{ i }]) => color(Z[i]))
    .attr("d", area);

  area_g.append("title").text(([{ i }]) => Z[i]);

  // Create the hover line
  g_zoomable.append("rect").attr("class", "vline").attr("width", rect_dim);

  // create tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip-donut")
    .style("opacity", 0);

  area_g
    .on("mouseover", function (event, d) {
      selected_id = d3.select(this).data()[0][0]["i"];
      selected_mod = Z[selected_id];
      d3.select(this).attr("opacity", 0.5);
      const x_shift = d3.pointer(event)[0];
      console.log("stackedchart mouseover", x_shift, d);

      d3.selectAll(".vline")
        .attr("height", height)
        .attr("opacity", 0.2)
        .transition()
        .duration(200)
        .attr(
          "transform",
          // d3.select(this).attr("transform")
          `translate(${x_shift - rect_dim / 2}, 0)`

          // `translate(${xScale(d[X_field]) - (rect_dim / 2) * 0}, 0)`
        );

      iii = d3
        .selectAll(".g_point")
        .data()
        .findIndex((x) => x.mod == selected_mod);
      console.log("wtf", iii, selected_mod);
      found_datapoint = d3.selectAll(".g_point").nodes()[iii];
      console.log("wtf", d3.select(found_datapoint).attr("transform"));
      const y_shift = parseFloat(
        d3.select(found_datapoint).attr("transform").split(",")[1]
      );

      console.log(
        "wtf found id-",
        selected_id,
        d3.select(found_datapoint).attr("transform"),
        y_shift
      );
      d3.selectAll(".hline")
        .attr("height", 10)
        .attr("width", width)
        .attr("opacity", 0.2)
        .transition()
        .duration(200)
        .attr(
          "transform",
          // d3.select(this).attr("transform")
          `translate(0,${y_shift - rect_dim / 2})`

          // `translate(${xScale(d[X_field]) - (rect_dim / 2) * 0}, 0)`
        );

      // show tooltip
      temp_text = "to be added";
      tooltip
        .html(temp_text)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 15 + "px")
        .transition()
        .duration(200)
        .style("opacity", 0.9);
    })
    .on("mouseout", function (event, d) {
      d3.select(this).attr("opacity", 1);
      d3.selectAll(".hover-line").attr("opacity", 0);

      // hide tooltip
      // show tooltip
      tooltip.transition().duration(50).style("opacity", 0);
    });

  svg_hoder.attr("id", "stackedchart_svg");
  return Object.assign(svg_hoder.node(), { scales: { color } });
}

function render_scatterplot_tsne(data, X_field, Y_field, color_field) {
  //   X_field = "intime";
  //   Y_field = "hadm_id";
  //   color_field = "careunit";
  var currentZoom = 1;

  console.log(data.slice(0, 10));

  // Extract the variables from the data
  var ys = data.map((d) => +d[Y_field]);
  var xs = data.map((d) => +d[X_field]);
  var names = data.map((d) => d[color_field]);

  console.log("HHHHHH", names);

  var tooltip = d3.select(".tooltip").style("opacity", 0);

  //   const mouseover = (event, d) => {
  //     tooltip.style("opacity", 1).style("left", event.pageX + 10 + "px");
  //     console.log(d);
  //   };

  //   const mouseleave = (event, d) => {
  //     tooltip.style("opacity", 0);
  //   };

  const svg_holder = d3.select("#scatterplot_tsne");

  var margin = { top: 20, right: 20, bottom: 60, left: 60 };
  var width = parseInt(svg_holder.style("width")) - margin.left - margin.right;
  var height =
    parseInt(svg_holder.style("height")) - margin.top - margin.bottom;

  console.log(width, height, margin);
  // Set up the plot
  var scatterplot = svg_holder
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xScale = d3.scaleLinear().domain(d3.extent(xs)).range([0, width]);
  // var xScale = d3.scaleTime().domain([new Date("2100-01-01"), new Date("2200-01-05")]).range([0, width]);
  var yScale = d3.scaleLinear().domain(d3.extent(ys)).range([height, 0]);
  console.log(d3.extent(ys), d3.extent(xs));
  var colorScale = d3.scaleOrdinal().domain(names).range(d3.schemeCategory10);

  render_legend_tsne(colorScale);

  console.log(xScale, yScale, colorScale);
  var xAxis = d3.axisBottom().scale(xScale).ticks(5, ".1f");
  var yAxis = d3.axisLeft().scale(yScale).ticks(5, ".1f");

  var g_xAxis = scatterplot
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(" + "0," + height + ")")
    .call(xAxis);

  var g_yAxis = scatterplot.append("g").attr("class", "y-axis").call(yAxis);

  // add invisible tooltip area
  var divToolTip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip-donut")
    .style("opacity", 0);

  zoomable_rect = scatterplot
    .append("rect")
    .attr("class", "state_zoomable")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "red")
    .style("pointer-events", "all")
    .attr("opacity", 0.1);

  // Add the points

  allPoints = scatterplot
    .selectAll(".point")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "point")
    .attr("cx", function (d) {
      return xScale(d[X_field]);
    })
    .attr("cy", function (d) {
      return yScale(d[Y_field]);
    })
    .attr("r", 3 / currentZoom)
    .attr("fill", function (d) {
      return colorScale(d[color_field]);
    })
    .on("mouseover", function (event, d) {
      i = 0;
      console.log("qwert_tsne", d3.pointer(event));

      console.log("HOVER", i);

      PAT_ID = d3.selectAll("circle").nodes().indexOf(this);

      console.log("HOVER", PAT_ID);

      plot_states();
      console.log(
        d[X_field],
        xScale(d[X_field]),
        xScale.domain(),
        xScale.range()
      );
      // console.log(d3.event.pageX, d3.event.pageY, d[X_field], d[Y_field]);

      d3.select(this)
        .transition()
        .duration("50")
        .attr("r", 6 / currentZoom);
      //Makes the new div appear on hover:
      //   divToolTip.transition().duration(50).style("opacity", 1);

      // let num = `${X_field}: ${d[X_field]} <br> ${Y_field}: ${d[Y_field]} <br> ${color_field}: ${d[color_field]}`;
      let num = `${d[color_field]}`;

      // divToolTip
      //   .html(num)
      //   .style("left", d3.event.pageX + 10 + "px")
      //   .style("top", d3.event.pageY - 15 + "px")
      //   .transition()
      //   .duration(50)
      //   .style("opacity", 1);
      console.log(d3.pointer(event));
      divToolTip
        .html(num)
        .style("left", d3.pointer(event)[0] + 10 + "px")
        .style("top", d3.pointer(event)[0] - 15 + "px")
        .transition()
        .duration(50)
        .style("opacity", 1);

      // console.log(divToolTip.attr("style"));

      // console.log(d3.event.pageX, d3.event.pageY, d[X_field], d[Y_field]);
    })
    .on("mouseout", function (d, i) {
      d3.select(this)
        .transition()
        .duration("50")
        .attr("r", 3 / currentZoom);
      //Makes the new div disappear:
      divToolTip.transition().duration(50).style("opacity", 0);
    });
  // .append("title")
  // .text(function (d) {
  //   let num = `id: ${d[Y_field]} \n name: ${d[color_field]} \n timestamp: ${d[X_field]}`;
  //   return num;
  // });

  // Add zoom functionality
  zoomable_rect.call(
    d3
      .zoom()
      .extent([
        [margin.left, margin.top],
        [width, height],
      ])
      .scaleExtent([1, 8])
      .on("zoom", function () {
        scatterplot
          .selectAll(".point")
          .attr("transform", d3.event.transform)
          .attr("r", 3 / d3.event.transform.k);
        currentZoom = d3.event.transform.k;
        //   console.log("zooming");

        // const newXScale = d3.event.transform.rescaleX(xScale);
        // const newYScale = d3.event.transform.rescaleY(yScale);
        console.log(xScale.domain(), yScale.domain());
        // xScale.domain(d3.event.transform.rescaleX(xScale).domain());
        // xScale.domain(newXDomain);

        // recover the new scale
        var newX = d3.event.transform.rescaleX(xScale);
        var newY = d3.event.transform.rescaleY(yScale);

        // yScale.domain(d3.event.transform.rescaleY(yScale).domain());
        console.log("AFTER", newX.domain(), newY.domain());
        console.log(currentZoom);
        // yScale.domain(newYDomain);

        // xScale.domain(d3.event.transform.rescaleX(xScale).domain());
        // yScale.domain(d3.event.transform.rescaleY(yScale).domain());
        //   xScale.scale(newXScale);
        //   yScale.scale(newYScale);

        // update axis
        xAxis.scale(newX);
        scatterplot.select(".x-axis").call(xAxis);
        yAxis.scale(newY);
        scatterplot.select(".y-axis").call(yAxis);

        // scatterplot.select(".x-axis").call(d3.axisBottom(newXScale));

        // scatterplot.select(".y-axis").call(d3.axisLeft(newYScale));

        // g_xAxis.call(d3.axisBottom(xScale));

        // g_yAxis.call(d3.axisLeft(yScale));

        // console.log(
        //   data[10][X_field],
        //   newXScale(data[10][X_field]),
        //   newXScale.domain(),
        //   newXScale.range()
        // );

        //hide out of plot data
        // allPoints
        //   .filter(function (d) {
        //     return (
        //       d[X_field] > xScale.domain()[1] ||
        //       d[X_field] < xScale.domain()[0] ||
        //       d[Y_field] > yScale.domain()[1] ||
        //       d[Y_field] < yScale.domain()[0]
        //     );
        //   })
        //   .transition()
        //   .duration(100)
        //   .attr("cx", function (d) {
        //     return xScale(d[X_field]) + 0 * margin.left;
        //   })
        //   .attr("cy", function (d) {
        //     return yScale(d[Y_field]) - margin.top * 0;
        //   })
        //   .style("opacity", "0.1");

        //show in of plot data
        // allPoints
        //   .filter(function (d) {
        //     return (
        //       d[X_field] < xScale.domain()[1] &&
        //       d[X_field] > xScale.domain()[0] &&
        //       d[Y_field] < yScale.domain()[1] &&
        //       d[Y_field] > yScale.domain()[0]
        //     );
        //   })
        //   .transition()
        // allPoints
        //   .transition()
        //   .duration(100)
        //   .attr("cx", function (d) {
        //     return newX(d[X_field]) + 0 * margin.left;
        //   })
        //   .attr("cy", function (d) {
        //     return newY(d[Y_field]) - margin.top * 0;
        //   })
        //   .style("opacity", "1");
      })
  );

  //   Add brushing
  var brush = d3
    .brushX() // Add the brush feature using the d3.brush function
    .extent([
      //   [margin.left, height + margin.top],
      //   [width + margin.left, height + margin.top + margin.bottom],
      [0, height],
      [width, height + margin.bottom],
    ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("end", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function

  scatterplot.append("g").attr("class", "brush").call(brush);

  // A function that set idleTimeOut to null
  var idleTimeout;
  function idled() {
    idleTimeout = null;
  }

  // A function that update the chart for given boundaries
  function updateChart() {
    extent = d3.event.selection;

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if (!extent) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
      console.log("brush DC", d3.extent(xs));

      console.log("xScale.domain() prev", xScale.domain());
      xScale.domain(d3.extent(xs));

      console.log("xScale.domain() after", xScale.domain());

      console.log("DEB", xScale.domain());
      // console.log("extent", extent[0], extent[1]);
    } else {
      console.log("tsne brushed");
      console.log("xScale.domain() prev", xScale.domain());
      // console.log("extent", extent[0], extent[1]);

      xScale.domain([
        xScale.invert(extent[0] - margin.left * 0),
        xScale.invert(extent[1] - margin.left * 0),
      ]);
      console.log("xScale.domain() after", xScale.domain());
      scatterplot.select(".brush").call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and circle position

    console.log("xScale.domain() out", xScale.domain());
    console.log(allPoints);
    console.log(g_xAxis);
    g_xAxis.transition().duration(1000).call(d3.axisBottom(xScale));
    allPoints
      .transition()
      .duration(1000)
      .attr("cx", function (d) {
        return xScale(d[X_field]);
      })
      .attr("cy", function (d) {
        return yScale(d[Y_field]);
      });

    //   //hide out of plot data
    //   allPoints
    //     .filter(function (d) {
    //       return (
    //         d[X_field] > xScale.domain()[1] ||
    //         d[X_field] < xScale.domain()[0] ||
    //         d[Y_field] > yScale.domain()[1] ||
    //         d[Y_field] < yScale.domain()[0]
    //       );
    //     })
    //     .transition()
    //     .duration(1000)
    //     .attr("cx", function (d) {
    //       return xScale(d[X_field]) + margin.left;
    //     })
    //     .attr("cy", function (d) {
    //       return yScale(d[Y_field]) + margin.top;
    //     })
    //     .style("opacity", "0");
  }
}

function argsort(arr1, arr2) {
  return arr1
    .map((item, index) => [arr2[index], item]) // add the args to sort by
    .sort(([arg1], [arg2]) => arg2 - arg1) // sort by the args
    .map(([, item]) => item); // extract the sorted items
}

function getOnlyOneColumn(data, column) {
  return data.map((e) => e[column]);
}
function argsort_values(data, t, ys) {
  var a = data
    .filter(function (d) {
      return d.abs_time == t;
    })
    .map(({ value, mod }) => ({ value, mod }));
  var values = getOnlyOneColumn(a, "value");
  var mods = getOnlyOneColumn(a, "mod");
  var values_argsorted = argsort(mods, values);
  var bounds = d3.extent(ys);
  for (let i = bounds[1]; i >= bounds[0]; --i) {
    if (!mods.includes(i)) {
      values_argsorted.push(i);
    }
  }
  return values_argsorted;
}

function reorderMods(min, max, mod, mods_argsorted) {
  for (let i = min; i <= max; ++i) {
    if (mod == mods_argsorted[i]) {
      return max - i;
    }
  }
}

function render_scatterplot_states(
  data,
  X_field,
  Y_field,
  color_field,
  att = null,
  {
    marginTop = 20, // top margin, in pixels
    marginRight = 20, // right margin, in pixels
    marginBottom = 60, // bottom margin, in pixels
    marginLeft = 60, // left margin, in pixels
    width = 900,
    height = 450,
    rect_dim = 10,
  }
) {
  //   X_field = "intime";
  //   Y_field = "hadm_id";
  //   color_field = "careunit";
  var currentZoom = 1;
  const att_scale = 1.5;
  console.log(data.slice(0, 10));

  // Extract the variables from the data
  var ys = data.map((d) => +d[Y_field]);
  var xs = data.map((d) => +d[X_field]);
  var names = data.map((d) => d[color_field]);

  console.log("HHHHHH", names);

  var tooltip = d3.select(".tooltip").style("opacity", 0);

  //   const mouseover = (event, d) => {
  //     tooltip.style("opacity", 1).style("left", event.pageX + 10 + "px");
  //     console.log(d);
  //   };

  //   const mouseleave = (event, d) => {
  //     tooltip.style("opacity", 0);
  //   };

  console.log("width", width, "height", height);
  const svg_holder = d3
    .create("svg")
    .attr("id", "scatterplot_states2")
    .attr("width", width + marginLeft + marginRight)
    .attr("height", height + marginTop + marginBottom);

  var margin = {
    top: marginTop,
    right: marginRight,
    bottom: marginBottom,
    left: marginLeft,
  };
  // var width = parseInt(svg_holder.style("width")) - margin.left - margin.right;
  // var height =
  //   parseInt(svg_holder.style("height")) - margin.top - margin.bottom;

  console.log("NAMES", width, height);
  // Set up the plot
  var scatterplot = svg_holder
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xScale = d3
    .scaleLinear()
    .domain([d3.min(xs) - 5, d3.max(xs) + 5])
    .range([0, width]);
  // var xScale = d3.scaleTime().domain([new Date("2100-01-01"), new Date("2200-01-05")]).range([0, width]);
  var yScale = d3
    .scaleLinear()
    .domain([d3.min(ys) - 1, d3.max(ys) + 1])
    .range([height, 0]);
  console.log(d3.extent(ys), d3.extent(xs));
  // var colorScale = d3
  //   .scaleSequential()
  //   .domain([-2, 2])
  //   .interpolator(d3.interpolateRgb("blue", "red"));

  var colorScale = d3
    .scaleLinear()
    .domain([-2, 0, 2])
    .range(["blue", "white", "red"])
    .interpolate(d3.interpolateRgb.gamma(1));
  //   render_legend_tsne(colorScale);

  console.log(xScale, yScale, colorScale);
  var xAxis = d3.axisBottom().scale(xScale).ticks(10, ".0f");
  var yAxis = d3.axisLeft().scale(yScale).ticks(20, ".0f");

  var g_xAxis = scatterplot
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(" + "0," + height + ")")
    .call(xAxis);

  var g_yAxis = scatterplot.append("g").attr("class", "y-axis").call(yAxis);

  // add invisible tooltip area
  var divToolTip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip-donut")
    .style("opacity", 0);

  zoomable_rect = scatterplot
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "red")
    .style("pointer-events", "all")
    .attr("opacity", 0.1);

  // *********************************************************************  Adding points

  allPoints = scatterplot
    .append("g")
    .attr("class", "g_allpoints")
    .selectAll(".g_point")
    .data(data)
    .join("g")
    .attr("class", "g_point")
    .attr("transform", function (d) {
      return `translate(${xScale(d[X_field])},${yScale(d[Y_field])})`;
    });

  // plot attention
  if (att != null) {
    atts = data.map((d) => +d[att]);
    var att_colorScale = d3
      .scaleLinear()
      .domain([0, d3.max(atts)])
      .range(["white", "green"])
      .interpolate(d3.interpolateRgb.gamma(1));

    var att_oppacity = d3
      .scaleLinear()
      .domain([0, d3.max(atts)])
      .range([0, 1]);

    allPoints
      .append("rect")
      .attr("class", "point_att")
      .attr("x", function (d) {
        return xScale(d[X_field]) * 0 - (rect_dim * att_scale) / 2;
      })
      .attr("y", function (d) {
        return yScale(d[Y_field]) * 0 - (rect_dim * att_scale) / 2;
      })
      .attr("width", ((rect_dim * att_scale) / currentZoom) * 1)
      .attr("height", ((rect_dim * att_scale) / currentZoom) * 1)
      .attr("fill", function (d) {
        return att_colorScale(d[att]);
      })
      .attr("opacity", function (d) {
        return att_oppacity(d[att]);
      });
  }
  // plot values
  allPoints
    .append("rect")
    .attr("class", "point_val")
    .attr("x", function (d) {
      return xScale(d[X_field]) * 0 - rect_dim / 2;
    })
    .attr("y", function (d) {
      return yScale(d[Y_field]) * 0 - rect_dim / 2;
    })
    .attr("width", (rect_dim / currentZoom) * 1)
    .attr("height", (rect_dim / currentZoom) * 1)
    .attr("fill", function (d) {
      return colorScale(d[color_field]);
    });

  console.log("ALL POINTS", allPoints);

  // *********************************************************************  Variable re-ordering
  allPoints.on("click", function (event, d) {
    var time = d[X_field];

    var mods_sorted = argsort_values(data, time, d3.extent(ys));
    console.log("mods_sorted", mods_sorted);

    allPoints
      .transition()
      .duration(1000)
      .attr("transform", function (d) {
        temp = yScale(
          reorderMods(
            d3.extent(ys)[0],
            d3.extent(ys)[1],
            d[Y_field],
            mods_sorted
          )
        );
        console.log(
          "temp",
          reorderMods(
            d3.extent(ys)[0],
            d3.extent(ys)[1],
            d[Y_field],
            mods_sorted
          ),
          temp
        );
        return `translate(${xScale(d[X_field])},${temp})`;
        return `translate(${xScale(d[X_field])},${yScale(d[Y_field])})`;
      });
  });

  // *********************************************************************  Hover Line

  // Create the hover line
  const g_hoverlines = scatterplot.append("g").attr("class", "hover-lines");
  g_hoverlines
    .append("rect")
    .attr("class", "hline")
    .attr("height", rect_dim)
    .attr("width", width)
    .attr("opacity", "0.1");

  g_hoverlines
    .append("rect")
    .attr("class", "vline")
    .attr("width", rect_dim)
    .attr("height", height)
    .attr("opacity", "0.1");
  // *********************************************************************  TOOLTIP
  allPoints
    .on("mouseover", function (event, d) {
      console.log("HOVER");
      console.log(
        d[X_field],
        xScale(d[X_field]),
        xScale.domain(),
        xScale.range()
      );
      // console.log(d3.event.pageX, d3.event.pageY, d[X_field], d[Y_field]);

      d3.select(this)
        .transition()
        .duration("50")
        .attr("width", (1.5 * rect_dim) / currentZoom)
        .attr("height", (1.5 * rect_dim) / currentZoom);

      //Makes the new div appear on hover:
      //   divToolTip.transition().duration(50).style("opacity", 1);

      // let num = `${X_field}: ${d[X_field]} <br> ${Y_field}: ${d[Y_field]} <br> ${color_field}: ${d[color_field]}`;
      let num = `time: ${d3.format(".1f")(d[X_field])} h <br> Variable: ${
        d[Y_field]
      } <br> Value: ${d3.format(".2f")(d[color_field])}`;

      if (att != null) {
        num += `<br>Attention: ${d3.format(".3f")(d[att])}`;
      }

      divToolTip
        .html(num)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 15 + "px")
        .transition()
        .duration(50)
        .style("opacity", 1);

      // console.log(divToolTip.attr("style"));

      // console.log(d3.event.pageX, d3.event.pageY, d[X_field], d[Y_field]);

      // adding the hover line
      // hoverLine.style("display", null);

      console.log("ret", d3.select(this).data(), d3.select(this).node());

      x_shift = parseFloat(
        d3
          .select(this)
          .attr("transform")
          .match(/translate\(\s*([^\s,)]+)/)[1]
      );

      y_shift = parseFloat(d3.select(this).attr("transform").split(",")[1]);
      console.log("x_shift", x_shift, y_shift);
      d3.selectAll(".vline")
        .attr("height", height)
        .attr("opacity", 0.2)
        .transition()
        .duration(200)
        .attr("transform", `translate(${x_shift - rect_dim / 2}, 0)`);

      d3.selectAll(".hline")
        .attr("height", 10)
        .attr("width", width)
        .attr("opacity", 0.2)
        .transition()
        .duration(200)
        .attr("transform", `translate(0,${y_shift - rect_dim / 2})`);

      // ploit hover line on stacked chart

      if (d3.select("#stackedchart")["_groups"][0].length == 1) {
      }
      // d3.selectAll('.hover-line').attr('x',0).attr('opacity',1).style('display',null).attr('height',100).attr('y',50).attr('transform',`translate(${x},0)`)
    })
    .on("mouseout", function (d, i) {
      d3.select(this)
        .transition()
        .duration("50")
        .attr("width", rect_dim / currentZoom)
        .attr("height", rect_dim / currentZoom);
      //Makes the new div disappear:
      divToolTip.transition().duration(50).style("opacity", 0);
      // hoverLine.style("display", "none");
    });
  // .append("title")
  // .text(function (d) {
  //   let num = `id: ${d[Y_field]} \n name: ${d[color_field]} \n timestamp: ${d[X_field]}`;
  //   return num;
  // });

  // *********************************************************************  ZOOMING
  const zoom = d3
    .zoom()
    .extent([
      [margin.left, margin.top],
      [width, height],
    ])
    .scaleExtent([1 / 4, 8])
    .on("zoom", function (event) {
      scatterplot.selectAll(".g_allpoints").attr("transform", event.transform);

      scatterplot.selectAll(".hover-lines").attr("transform", event.transform);

      // sync the zooming of the scatterplot and the stacked chart

      d3.select("#stack_zoomable").attr("transform", (d, i) => {
        const [tx, ty] = [event.transform.x, 0]; // Set ty to 0 to disable y-axis translation
        const [sx, sy] = [event.transform.k, 1]; // Keep the original scaling values

        return `translate(${tx}, ${ty}) scale(${sx}, ${sy})`;
      });

      currentZoom = event.transform.k;

      console.log(xScale.domain(), yScale.domain());

      // recover the new scale
      var newX = event.transform.rescaleX(xScale);
      var newY = event.transform.rescaleY(yScale);

      // yScale.domain(event.transform.rescaleY(yScale).domain());
      console.log("AFTER", newX.domain(), newY.domain());
      console.log(currentZoom);

      // update axis
      xAxis.scale(newX);
      scatterplot.select(".x-axis").call(xAxis);
      yAxis.scale(newY);
      scatterplot.select(".y-axis").call(yAxis);
    });

  zoomable_rect.call(zoom);

  // *********************************************************************  BRUSHING
  var brush = d3
    .brushX() // Add the brush feature using the d3.brush function
    .extent([
      //   [margin.left, height + margin.top],
      //   [width + margin.left, height + margin.top + margin.bottom],
      [0, height],
      [width, height + margin.bottom],
    ]); // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
  // .on("end", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function

  scatterplot.append("g").attr("class", "brush").call(brush);

  // A function that set idleTimeOut to null
  var idleTimeout;
  function idled() {
    idleTimeout = null;
  }

  // A function that update the chart for given boundaries
  function updateChart(event) {
    console.log("updateChart");
    extent = event.selection;
    console.log("extent1", extent);

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if (!extent) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
      xScale.domain(d3.extent(xs));
      console.log("DC", d3.extent(xs));
    } else {
      xScale.domain([
        xScale.invert(extent[0] - margin.left * 0),
        xScale.invert(extent[1] - margin.left * 0),
      ]);

      console.log("DATA", data);

      console.log([xScale.invert(extent[0]), xScale.invert(extent[1])]);
      console.log("extent", extent[0], extent[1]);

      scatterplot.select(".brush").call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and circle position
    g_xAxis.transition().duration(1000).call(d3.axisBottom(xScale));
    console.log("DEB", xScale.domain());

    allPoints
      .transition()
      .duration(1000)
      .attr("transform", function (d) {
        return `translate(${xScale(d[X_field])},${yScale(d[Y_field])})`;
      });
  }
  // return Object.assign(svg_holder.node(), { scales: { color } });
  return svg_holder.node();
}

function ffill3(data) {
  n_time = "abs_time";
  n_var = "mod";
  n_val = "value";
  max_vars = 32;

  const imputedData = [];

  // step 1: get unique times and variables
  unique_times = [...new Set(data.map((d) => new Date(d[n_time])))];
  unique_times = [...new Set(data.map((d) => d[n_time]))];
  unique_vars = [...new Set(data.map((d) => d[n_var]))];
  unique_vars = Array.from({ length: max_vars }, (_, index) => index);
  const updatedData = data;
  // Mapping from variable string to index
  // const mapping = {};
  // unique_vars.forEach((value, index) => {
  //   mapping[value] = index;
  // });

  // const updatedData = data.map((obj) => {
  //   return { ...obj, [n_var]: mapping[obj[n_var]] };
  // });

  // unique_vars = [...new Set(updatedData.map((d) => d[n_var]))];

  console.log(data);
  console.log(unique_times);
  console.log(unique_vars);
  // step 2: sort data by time and variable
  data.sort((a, b) => {
    // Sort by time in ascending order
    if (a[n_time] !== b[n_time]) {
      return a[n_time] - b[n_time];
    }

    // If time is the same, sort by variable string
    return a[n_var] - b[n_var];
  });
  console.log("sorted", data);
  // step 3: iterate over unique times and variables

  for (time of unique_times) {
    for (mod of unique_vars) {
      // find the data point with the same time and variable
      temp = data.filter((d) => {
        return d[n_time] === time && d[n_var] === mod;
      });

      if (temp.length === 0) {
        // if no data point with the same time and variable
        temp = data.filter((d) => {
          // find the data point with the same variable and time less than the current time
          return d[n_time] < time && d[n_var] === mod;
        });
        if (temp.length === 0) {
          // if again no data point, impute with nan
          imputedData.push({
            [n_time]: time,
            [n_val]: 0,
            [n_var]: mod,
            att: 0,
          });
        } else {
          // if found data point, impute with the value of the data point
          // temp[0][n_val] =
          //   Math.abs(temp[0][n_val]) > 1 ? Math.abs(temp[0][n_val]) - 1 : 0;

          // temp[0][n_time] = time;

          //   imputedData.push(temp[0]);

          val2save =
            Math.abs(temp[temp.length - 1][n_val]) > 1
              ? Math.abs(temp[temp.length - 1][n_val]) - 1
              : 0;
          // val2save = temp[temp.length - 1][n_val];
          imputedData.push({
            [n_time]: time,
            [n_val]: val2save,

            [n_var]: mod,
            att: 0,
          });
        }
      } else {
        // if found data point, impute with the value of the data point
        // Math.abs(d.value) > 1
        // ? (Math.abs(d.value) - 1) * Math.sign(d.value) * Math.sign(d.value)
        // : 0;
        val2save =
          Math.abs(temp[temp.length - 1][n_val]) > 1
            ? Math.abs(temp[temp.length - 1][n_val]) - 1
            : 0;
        // val2save = temp[temp.length - 1][n_val];
        imputedData.push({
          [n_time]: time,
          [n_val]: val2save,
          [n_var]: mod,
        });
      }
    }
  }

  // step 4: sort imputed data by time and variable
  imputedData.sort((a, b) => {
    // Sort by time in ascending order
    if (a[n_time] !== b[n_time]) {
      return a[n_time] - b[n_time];
    }

    // If time is the same, sort by variable string
    return a[n_var] - b[n_var];
  });
  return imputedData;
}
