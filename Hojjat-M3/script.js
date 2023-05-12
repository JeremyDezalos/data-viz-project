// import { render_scatterplot } from "./scatterplot.js";
// import "core-js/actual/array/group-by";

PATH = "../resources/sepsis1/core/transfers.csv";
PATH = "../resources/tsne_datavis.json";

var currentZoom = 1;
var PAT_ID = 0;
const selected_hadm_ids = new Set(); // set of selected hadm_ids

d3.json(PATH)
  .then(function (data) {
    console.log(data);
    // data.forEach((element) => {
    //   element.intime = new Date(element.intime);
    // });

    return data;
  })
  .then((data) => {
    render_scatterplot(data, "x", "y", "color");
    // sankeyplot(data);
  });

function render_scatterplot(data, X_field, Y_field, color_field) {
  //   X_field = "intime";
  //   Y_field = "hadm_id";
  //   color_field = "careunit";
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

  const svg_holder = d3.select("#scatterplot");

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
    .on("mouseover", function (d, i) {
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
        .attr("r", 6 / currentZoom);
      //Makes the new div appear on hover:
      //   divToolTip.transition().duration(50).style("opacity", 1);

      let num = `${X_field}: ${d[X_field]} <br> ${Y_field}: ${d[Y_field]} <br> ${color_field}: ${d[color_field]}`;

      divToolTip
        .html(num)
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY - 15 + "px")
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
