// import { render_scatterplot } from "./scatterplot.js";
// import "core-js/actual/array/group-by";

PATH = "../resources/sepsis1/core/transfers.csv";

var currentZoom = 1;

const selected_hadm_ids = new Set(); // set of selected hadm_ids

d3.csv(PATH)
  .then(function (data) {
    data.forEach((element) => {
      element.intime = new Date(element.intime);
    });

    data.sort(function (a, b) {
      if (a.hadm_id === b.hadm_id) {
        return a.intime - b.intime;
      } else {
        return a.hadm_id - b.hadm_id;
      }
    });

    var first100Rows = [];
    for (var i = 0; i < 1000; i++) {
      first100Rows.push(data[i]);
    }
    // console.log(first100Rows);
    return first100Rows;
  })
  .then((data) => {
    render_scatterplot(data, "intime", "hadm_id", "careunit");
    sankeyplot(data);
  });

function render_scatterplot(data, X_field, Y_field, color_field) {
  const unique_hadmids = [...new Set(data.map((item) => item.hadm_id))];

  // computing absolute intime
  for (var i = 0; i < unique_hadmids.length; i++) {
    var hadm_id = unique_hadmids[i];
    var hadm_id_data = data.filter((d) => d.hadm_id == hadm_id);

    const t_orignin = hadm_id_data[0].intime;
    hadm_id_data.forEach((element) => {
      element.intime = (element.intime - t_orignin) / 1000 / 60 / 60;
    });
  }

  //   X_field = "intime";
  //   Y_field = "hadm_id";
  //   color_field = "careunit";
  console.log(data.slice(0, 10));

  // Extract the variables from the data
  var ys = data.map((d) => +d[Y_field]);
  var xs = data.map((d) => d[X_field]);
  var names = data.map((d) => d[color_field]);

  console.log(names);

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

  // Set up the plot
  var scatterplot = svg_holder
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var xScale = d3.scaleLinear().domain(d3.extent(xs)).range([0, width]);
  // var xScale = d3.scaleTime().domain([new Date("2100-01-01"), new Date("2200-01-05")]).range([0, width]);
  var yScale = d3.scaleLinear().domain(d3.extent(ys)).range([height, 0]);

  var colorScale = d3.scaleOrdinal().domain(names).range(d3.schemeCategory10);

  var xAxis = d3.axisBottom(xScale);
  var yAxis = d3.axisLeft(yScale);

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

  const zoomable_rect = scatterplot
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "red")
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

      let num = `id: ${d[Y_field]} <br> name: ${d[color_field]} <br> timestamp: ${d[X_field]}`;

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
        [50, 50],
        // [width, height],
        [50, 50],
      ])
      .scaleExtent([1, 16])
      .on("zoom", function () {
        console.log("ZOOMING", [0, 0], [width, height]);
        scatterplot
          .selectAll(".point")
          .attr("transform", d3.event.transform)
          .attr("r", 3 / d3.event.transform.k);
        currentZoom = d3.event.transform.k;
        //   console.log("zooming");

        // const newXScale = d3.event.transform.rescaleX(xScale);
        // const newYScale = d3.event.transform.rescaleY(yScale);

        const newXDomain = d3.event.transform.rescaleX(xScale).domain();
        xScale.domain(newXDomain);

        const newYDomain = d3.event.transform.rescaleY(yScale).domain();
        yScale.domain(newYDomain);

        // xScale.domain(d3.event.transform.rescaleX(xScale).domain());
        // yScale.domain(d3.event.transform.rescaleY(yScale).domain());
        //   xScale.scale(newXScale);
        //   yScale.scale(newYScale);

        // update axis
        xAxis.scale(xScale);
        scatterplot.select(".x-axis").call(xAxis);
        yAxis.scale(yScale);
        scatterplot.select(".y-axis").call(yAxis);

        // scatterplot.select(".x-axis").call(d3.axisBottom(newXScale));

        // scatterplot.select(".y-axis").call(d3.axisLeft(newYScale));

        // g_xAxis.call(d3.axisBottom(xScale));

        // g_yAxis.call(d3.axisLeft(yScale));

        // console.log("newXScale", newXScale.domain(), newYScale.domain());
        console.log(
          data[10][X_field],
          xScale(data[10][X_field]),
          xScale.domain(),
          xScale.range()
        );

        // console.log(
        //   data[10][X_field],
        //   newXScale(data[10][X_field]),
        //   newXScale.domain(),
        //   newXScale.range()
        // );

        //hide out of plot data
        allPoints
          .filter(function (d) {
            return (
              d[X_field] > xScale.domain()[1] ||
              d[X_field] < xScale.domain()[0] ||
              d[Y_field] > yScale.domain()[1] ||
              d[Y_field] < yScale.domain()[0]
            );
          })
          .transition()
          .duration(100)
          .attr("cx", function (d) {
            return xScale(d[X_field]) + 0 * margin.left;
          })
          .attr("cy", function (d) {
            return yScale(d[Y_field]) - margin.top * 0;
          })
          .style("opacity", "0.1");

        //show in of plot data
        allPoints
          .filter(function (d) {
            return (
              d[X_field] < xScale.domain()[1] &&
              d[X_field] > xScale.domain()[0] &&
              d[Y_field] < yScale.domain()[1] &&
              d[Y_field] > yScale.domain()[0]
            );
          })
          .transition()
          .duration(200)
          .attr("cx", function (d) {
            return xScale(d[X_field]) + 0 * margin.left;
          })
          .attr("cy", function (d) {
            return yScale(d[Y_field]) - margin.top * 0;
          })
          .style("opacity", "1");

        // sankeyplot(
        //   data.filter(
        //     (d) =>
        //       d[X_field] < xScale.domain()[1] &&
        //       d[X_field] > xScale.domain()[0] &&
        //       d[Y_field] < yScale.domain()[1] &&
        //       d[Y_field] > yScale.domain()[0]
        //   ),
        //   X_field,
        //   Y_field,
        //   color_field
        // );
      })
  );

  // Add brushing
  // var brush = d3
  //   .brushX() // Add the brush feature using the d3.brush function
  //   .extent([
  //     [margin.left, height + margin.top],
  //     [width + margin.left, height + margin.top + margin.bottom],
  //     //   [0, 0],
  //     //   [width, height],
  //   ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
  //   .on("end", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function

  // scatterplot.append("g").attr("class", "brush").call(brush);

  // // A function that set idleTimeOut to null
  // var idleTimeout;
  // function idled() {
  //   idleTimeout = null;
  // }

  // // A function that update the chart for given boundaries
  // function updateChart() {
  //   extent = d3.event.selection;

  //   // If no selection, back to initial coordinate. Otherwise, update X axis domain
  //   if (!extent) {
  //     if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
  //     xScale.domain(d3.extent(xs));
  //     console.log("DC", d3.extent(xs));
  //   } else {
  //     xScale.domain([
  //       xScale.invert(extent[0] - margin.left),
  //       xScale.invert(extent[1] - margin.left),
  //     ]);

  //     console.log("DATA", data);

  //     console.log([xScale.invert(extent[0]), xScale.invert(extent[1])]);
  //     console.log("extent", extent[0], extent[1]);

  //     scatterplot.select(".brush").call(brush.move, null); // This remove the grey brush area as soon as the selection has been done
  //   }

  //   // Update axis and circle position
  //   g_xAxis.transition().duration(1000).call(d3.axisBottom(xScale));
  //   console.log("DEB", xScale.domain());
  //   allPoints
  //     .transition()
  //     .duration(1000)
  //     .attr("cx", function (d) {
  //       return xScale(d[X_field]) + margin.left;
  //     })
  //     .attr("cy", function (d) {
  //       return yScale(d[Y_field]) + margin.top;
  //     });

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

  // }
}

function sankeyplot(data, X_field, Y_field, color_field) {
  //   console.log("temp", data);
  console.log("NEW", data.length);
  partition = (data) =>
    d3.partition().size([2 * Math.PI, radius * radius])(
      d3
        .hierarchy(data)
        .sum((d) => d.value)
        .sort((a, b) => b.value - a.value)
    );

  width = 640;
  radius = width / 2;
  breadcrumbWidth = 75;
  breadcrumbHeight = 30;

  color = d3
    .scaleOrdinal()
    .domain(["home", "product", "search", "account", "other", "end"])
    .range(["#5d85cf", "#7c6561", "#da7847", "#6fb971", "#9e70cf", "#bbbbbb"]);

  arc = d3
    .arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .padAngle(1 / radius)
    .padRadius(radius)
    .innerRadius((d) => Math.sqrt(d.y0))
    .outerRadius((d) => Math.sqrt(d.y1) - 1);

  mousearc = d3
    .arc()
    .startAngle((d) => d.x0)
    .endAngle((d) => d.x1)
    .innerRadius((d) => Math.sqrt(d.y0))
    .outerRadius(radius);

  function buildHierarchy(csv) {
    // console.log(
    //   "csv",
    //   csv.length,
    //   csv[0],
    //   csv[0][22781],
    //   csv[0]["account-account-account-account-account-account"]
    // );
    // Helper function that transforms the given CSV into a hierarchical format.
    const root = { name: "root", children: [] };
    for (let i = 0; i < csv.length; i++) {
      const sequence =
        csv[i]["account-account-account-account-account-account"];
      const size = +csv[i][22781];
      //   console.log(size, sequence);
      if (isNaN(size)) {
        // e.g. if this is a header row
        continue;
      }
      const parts = sequence.split("-");
      let currentNode = root;
      for (let j = 0; j < parts.length; j++) {
        const children = currentNode["children"];
        const nodeName = parts[j];
        let childNode = null;
        if (j + 1 < parts.length) {
          // Not yet at the end of the sequence; move down the tree.
          let foundChild = false;
          for (let k = 0; k < children.length; k++) {
            if (children[k]["name"] == nodeName) {
              childNode = children[k];
              foundChild = true;
              break;
            }
          }
          // If we don't already have a child node for this branch, create it.
          if (!foundChild) {
            childNode = { name: nodeName, children: [] };
            children.push(childNode);
          }
          currentNode = childNode;
        } else {
          // Reached the end of the sequence; create a leaf node.
          childNode = { name: nodeName, value: size };
          children.push(childNode);
        }
      }
    }
    return root;
  }

  // Generate a string that describes the points of a breadcrumb SVG polygon.
  function breadcrumbPoints(d, i) {
    const tipWidth = 10;
    const points = [];
    points.push("0,0");
    points.push(`${breadcrumbWidth},0`);
    points.push(`${breadcrumbWidth + tipWidth},${breadcrumbHeight / 2}`);
    points.push(`${breadcrumbWidth},${breadcrumbHeight}`);
    points.push(`0,${breadcrumbHeight}`);
    if (i > 0) {
      // Leftmost breadcrumb; don't include 6th vertex.
      points.push(`${tipWidth},${breadcrumbHeight / 2}`);
    }
    return points.join(" ");
  }

  d3.csv("./visit-sequences@1.csv").then(function (data1) {
    // var csv = d3.csvParseRows(data1);

    data.sort(function (a, b) {
      if (a.hadm_id === b.hadm_id) {
        return a.intime - b.intime;
      } else {
        return a.hadm_id - b.hadm_id;
      }
    });

    const groupByCategory = data.reduce((group, d) => {
      const { hadm_id } = d;
      group[hadm_id] = group[hadm_id] ?? [];
      group[hadm_id].push(d);
      return group;
    }, {});

    const temp = [];
    for (let hid in groupByCategory) {
      // temp.push(
      const rrr = groupByCategory[hid].reduce((acc, curr) => {
        acc = acc + curr["careunit"] + "-";
        return acc;
      }, "");

      temp.push({
        22781: hid,
        "account-account-account-account-account-account": rrr,
      });

      // console.log("123DEB", rrr);
      // );
    }
    // const temp2 = groupByCategory.forEach((d) => {
    //   console.log("DEB3", d);
    // });
    // console.log("DEBBB", temp);

    // data1 = temp;
    data1 = buildHierarchy(temp);
    // console.log("NEWNEW", csv);
    const root = partition(data1);

    // console.log("root", root);
    const svg = d3.select("#svg-sunburst").text("");
    // Make this into a view, so that the currently hovered sequence is available to the breadcrumb
    const element = svg.node();
    element.value = { sequence: [], percentage: 0.0 };

    const label = svg
      .append("text")
      .attr("text-anchor", "middle")
      .attr("fill", "#888")
      .style("visibility", "hidden");

    label
      .append("tspan")
      .attr("class", "percentage")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "-0.1em")
      .attr("font-size", "3em")
      .text("");

    label
      .append("tspan")
      .attr("x", 0)
      .attr("y", 0)
      .attr("dy", "1.5em")
      .text("of visits begin with this sequence");

    svg
      .attr("viewBox", `${-radius} ${-radius} ${width} ${width}`)
      .style("max-width", `${width}px`)
      .style("font", "12px sans-serif");

    const path = svg
      .append("g")
      .selectAll("path")
      .data(
        root.descendants().filter((d) => {
          // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
          return d.depth && d.x1 - d.x0 > 0.001;
        })
      )
      .join("path")
      .attr("fill", (d) => color(d.data.name))
      .attr("d", arc);

    svg
      .append("g")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mouseleave", () => {
        path.attr("fill-opacity", 1);
        label.style("visibility", "hidden");
        // Update the value of this view
        element.value = { sequence: [], percentage: 0.0 };
        element.dispatchEvent(new CustomEvent("input"));
      })
      .selectAll("path")
      .data(
        root.descendants().filter((d) => {
          // Don't draw the root node, and for efficiency, filter out nodes that would be too small to see
          return d.depth && d.x1 - d.x0 > 0.001;
        })
      )
      .join("path")
      .attr("d", mousearc)
      .on("mouseenter", (event, d) => {
        // Get the ancestors of the current segment, minus the root
        // console.log("DDDDDDD", event);
        const sequence = event.ancestors().reverse().slice(1);
        // console.log("HOJAT", sequence);
        // Highlight the ancestors
        path.attr("fill-opacity", (node) =>
          sequence.indexOf(node) >= 0 ? 1.0 : 0.3
        );
        const percentage = ((100 * event.value) / root.value).toPrecision(3);
        label
          .style("visibility", null)
          .select(".percentage")
          .text(percentage + "%");
        // Update the value of this view with the currently hovered sequence and percentage
        element.value = { sequence, percentage };
        element.dispatchEvent(new CustomEvent("input"));
      });
  });

  //   csv = d3.csvParseRows("visit-sequences@1.csv");
}
