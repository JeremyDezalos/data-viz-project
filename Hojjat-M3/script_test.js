PATH = "../resources/sepsis1/core/transfers.csv";
// PATH = "../resources/sepsis1/hosp/diagnoses_icd.csv";

// PATH = "./iris.csv";

d3.csv(PATH)
  .then(function (data) {
    // for the transfer.csv
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

    // computing absolute intime
    const unique_hadmids = [...new Set(data.map((item) => item.hadm_id))];
    for (var i = 0; i < unique_hadmids.length; i++) {
      var hadm_id = unique_hadmids[i];
      var hadm_id_data = data.filter((d) => d.hadm_id == hadm_id);

      const t_orignin = hadm_id_data[0].intime;
      hadm_id_data.forEach((element) => {
        element.intime = (element.intime - t_orignin) / 1000 / 60 / 60;
      });
    }

    // // for ICD.csv
    // data.forEach((element) => {
    //   element.icd_code = element.icd_code.replace(/\s/g, "");
    // });
    // data.sort(function (a, b) {
    //   if (a.hadm_id === b.hadm_id) {
    //     return a.seq_num - b.seq_num;
    //   } else {
    //     return a.hadm_id - b.hadm_id;
    //   }
    // });

    var first100Rows = [];
    for (var i = 0; i < 1000; i++) {
      first100Rows.push(data[i]);
    }

    function convertIdsToUniqueIds(arr) {
      const idMap = {};
      return arr.map((obj) => {
        const uniqueId =
          idMap[obj.hadm_id] !== undefined
            ? idMap[obj.hadm_id]
            : Object.keys(idMap).length;
        idMap[obj.hadm_id] = uniqueId;
        return {
          ...obj,
          hadm_id: uniqueId,
        };
      });
    }

    const newArr = convertIdsToUniqueIds(first100Rows);

    return newArr;
  })
  .then((data) => {
    // render_scatterplot(data, "seq_num", "hadm_id", "icd_code");
    // sankeyplot(data, "seq_num", "hadm_id", "icd_code");

    render_scatterplot(data, "intime", "hadm_id", "careunit");
    sankeyplot(data, "intime", "hadm_id", "careunit");
  });

function render_scatterplot(data, X_field, Y_field, color_field) {
  var currentZoom = 1;
  //   // computing absolute intime
  //   const unique_hadmids = [...new Set(data.map((item) => item.hadm_id))];
  //   for (var i = 0; i < unique_hadmids.length; i++) {
  //     var hadm_id = unique_hadmids[i];
  //     var hadm_id_data = data.filter((d) => d.hadm_id == hadm_id);

  //     const t_orignin = hadm_id_data[0].intime;
  //     hadm_id_data.forEach((element) => {
  //       element.intime = (element.intime - t_orignin) / 1000 / 60 / 60;
  //     });
  //   }

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  //   console.log(data, X_field, Y_field, color_field);
  var ys = data.map((d) => +d[Y_field]);
  var xs = data.map((d) => +d[X_field]);
  var names = data.map((d) => d[color_field]);
  //   console.log(d3.extent(xs), d3.extent(ys));
  // append the SVG object to the body of the page
  var SVG = d3
    .select("#dataviz_axisZoom")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // add invisible tooltip area
  var divToolTip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip-donut")
    .style("opacity", 0);

  //Read the data
  //   console.log("DEB", d3.extent(xs));

  var colorScale = d3.scaleOrdinal().domain(names).range(d3.schemeCategory10);

  // Add X axis
  var x = d3.scaleLinear().domain(d3.extent(xs)).range([0, width]);
  var xAxis = SVG.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear().domain(d3.extent(ys)).range([height, 0]);

  var yAxis = SVG.append("g").call(d3.axisLeft(y));

  // Add a clipPath: everything out of this area won't be drawn.
  var clip = SVG.append("defs")
    .append("SVG:clipPath")
    .attr("id", "clip")
    .append("SVG:rect")
    .attr("width", width)
    .attr("height", height)
    .attr("x", 0)
    .attr("y", 0);

  // Create the scatter variable: where both the circles and the brush take place
  var scatter = SVG.append("g").attr("clip-path", "url(#clip)");
  // .style("pointer-events", "all");

  // Set the zoom and Pan features: how much you can zoom, on which part, and what to do when there is a zoom
  var zoom = d3
    .zoom()
    .scaleExtent([0.5, 20]) // This control how much you can unzoom (x0.5) and zoom (x20)
    .extent([
      [0, 0],
      [width, height],
    ])
    .on("zoom", updateChart);

  // This add an invisible rect on top of the chart area. This rect can recover pointer events: necessary to understand when the user zoom
  scatter
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("opacity", 0.1)
    .style("fill", "none")
    .style("pointer-events", "all")
    .call(zoom);

  // Add circles
  scatter
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d[X_field]);
    })
    .attr("cy", function (d) {
      return y(d[Y_field]);
    })
    .attr("r", 3 / 1)
    .attr("fill", function (d) {
      return colorScale(d[color_field]);
    })
    .on("mouseover", function (d, i) {
      //   console.log("mouseover");
      d3.select(this)
        .transition()
        .duration(50)
        .attr("r", 6 / 1);
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
    })
    .on("mouseout", function (d, i) {
      d3.select(this)
        .transition()
        .duration(50)
        .attr("r", 3 / 1);
      //Makes the new div appear on hover:
      //   divToolTip.transition().duration(50).style("opacity", 1);

      let num = `id: ${d[Y_field]} <br> name: ${d[color_field]} <br> timestamp: ${d[X_field]}`;

      divToolTip
        .html(num)
        .style("left", d3.event.pageX + 10 + "px")
        .style("top", d3.event.pageY - 15 + "px")
        .transition()
        .duration(50)
        .style("opacity", 0);
    })
    .style("opacity", 0.5 * 2);

  //   .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  // now the user can zoom and it will trigger the function called updateChart

  // A function that updates the chart when the user zoom and thus new boundaries are available
  function updateChart() {
    // recover the new scale
    var newX = d3.event.transform.rescaleX(x);
    var newY = d3.event.transform.rescaleY(y);
    currentZoom = d3.event.transform.k;

    // update axes with these new boundaries
    xAxis.call(d3.axisBottom(newX));
    yAxis.call(d3.axisLeft(newY));

    // update circle position
    scatter
      .selectAll("circle")
      .attr("cx", function (d) {
        return newX(d[X_field]);
      })
      .attr("cy", function (d) {
        return newY(d[Y_field]);
      })
      .attr("r", 3 * 1);
  }

  // Add brushing
  var brushX = d3
    .brushX() // Add the brush feature using the d3.brush function
    .extent([
      [0, height],
      [width, height + margin.bottom],
    ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
    .on("end", updateChart_brush); // Each time the brush selection changes, trigger the 'updateChart' function

  // Add the brushing
  SVG.append("g").attr("class", "brush").call(brushX);
  // .attr("width", width)
  // .attr("height", height)
  // .attr("fill", "red")

  // A function that set idleTimeOut to null
  var idleTimeout;
  function idled() {
    idleTimeout = null;
  }

  // A function that update the chart for given boundaries
  function updateChart_brush() {
    extent = d3.event.selection;

    // If no selection, back to initial coordinate. Otherwise, update X axis domain
    if (!extent) {
      if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
      x.domain(d3.extent(xs));
    } else {
      x.domain([x.invert(extent[0]), x.invert(extent[1])]);
      scatter.select(".brush").call(brushX.move, null); // This remove the grey brush area as soon as the selection has been done
    }

    // Update axis and circle position
    xAxis.transition().duration(1000).call(d3.axisBottom(x));
    scatter
      .selectAll("circle")
      .transition()
      .duration(1000)
      .attr("cx", function (d) {
        return x(d[X_field]);
      })
      .attr("cy", function (d) {
        return y(d[Y_field]);
      });
  }
}

function sankeyplot(data, X_field, Y_field, color_field) {
  //   console.log("temp", data);
  //   console.log("NEW", data.length);
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

  uniqueValues = [...new Set(data.map((item) => item[color_field]))];
  //   console.log("uniqueValues", data, color_field, uniqueValues);
  //   color = d3
  //     .scaleOrdinal()
  //     .domain(["home", "product", "search", "account", "other", "end"])
  //     .range(["#5d85cf", "#7c6561", "#da7847", "#6fb971", "#9e70cf", "#bbbbbb"]);

  color = d3.scaleOrdinal().domain(uniqueValues).range(d3.schemeCategory10);
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
        acc = acc + curr[color_field] + "-";
        return acc;
      }, "");

      temp.push({
        22781: hid,
        "account-account-account-account-account-account": rrr,
      });

      console.log("123DEB", rrr);
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
