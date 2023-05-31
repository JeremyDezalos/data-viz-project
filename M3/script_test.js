const data = [
  // { time: 0, variable: "HR", value: "1" },
  { time: 0, variable: "RR", value: "1.1" },
  { time: 0, variable: "Temp", value: "3" },
  { time: 1, variable: "HR", value: "1" },
  { time: 1, variable: "Temp", value: "3" },
  { time: 4, variable: "HR", value: "1" },
  { time: 4, variable: "RR", value: "1.1" },
];

const imputedData = [];

// step 1: get unique times and variables
unique_times = [...new Set(data.map((d) => d.time))];
unique_vars = [...new Set(data.map((d) => d.variable))];

// step 2: sort data by time and variable
data.sort((a, b) => {
  // Sort by time in ascending order
  if (a.time !== b.time) {
    return a.time - b.time;
  }

  // If time is the same, sort by variable string
  return a.variable.localeCompare(b.variable);
});

// step 3: iterate over unique times and variables
for (time of unique_times) {
  for (mod of unique_vars) {
    // find the data point with the same time and variable
    temp = data.filter((d) => {
      return d.time === time && d.variable === mod;
    });

    if (temp.length === 0) {
      // if no data point with the same time and variable
      temp = data.filter((d) => {
        // find the data point with the same variable and time less than the current time
        return d.time < time && d.variable === mod;
      });
      if (temp.length === 0) {
        // if again no data point, impute with nan
        imputedData.push({
          time: time,
          variable: mod,
          value: "nan",
        });
      } else {
        // if found data point, impute with the value of the data point
        imputedData.push(temp[0]);
      }
    } else {
      // if found data point, impute with the value of the data point
      imputedData.push(temp[0]);
    }
  }
}

// function ffill(data) {
//   const imputedData = [];

//   // step 1: get unique times and variables
//   unique_times = [...new Set(data.map((d) => d.time))];
//   unique_vars = [...new Set(data.map((d) => d.variable))];

//   // step 2: sort data by time and variable
//   data.sort((a, b) => {
//     // Sort by time in ascending order
//     if (a.time !== b.time) {
//       return a.time - b.time;
//     }

//     // If time is the same, sort by variable string
//     return a.variable.localeCompare(b.variable);
//   });

//   // step 3: iterate over unique times and variables
//   for (time of unique_times) {
//     for (mod of unique_vars) {
//       // find the data point with the same time and variable
//       temp = data.filter((d) => {
//         return d.time === time && d.variable === mod;
//       });

//       if (temp.length === 0) {
//         // if no data point with the same time and variable
//         temp = data.filter((d) => {
//           // find the data point with the same variable and time less than the current time
//           return d.time < time && d.variable === mod;
//         });
//         if (temp.length === 0) {
//           // if again no data point, impute with nan
//           imputedData.push({
//             time: time,
//             variable: mod,
//             value: "nan",
//           });
//         } else {
//           // if found data point, impute with the value of the data point
//           imputedData.push(temp[0]);
//         }
//       } else {
//         // if found data point, impute with the value of the data point
//         imputedData.push(temp[0]);
//       }
//     }
//   }
//   return imputedData;
// }

function ffill2(data) {
  n_time = "date";
  n_var = "industry";
  n_val = "unemployed";
  const imputedData = [];

  // step 1: get unique times and variables
  unique_times = [...new Set(data.map((d) => new Date(d[n_time])))];
  unique_times = [...new Set(data.map((d) => d[n_time]))];
  unique_vars = [...new Set(data.map((d) => d[n_var]))];
  console.log(unique_times);
  console.log(unique_vars);
  // step 2: sort data by time and variable
  data.sort((a, b) => {
    // Sort by time in ascending order
    if (a[n_time] !== b[n_time]) {
      return a[n_time] - b[n_time];
    }

    // If time is the same, sort by variable string
    return a[n_var].localeCompare(b[n_var]);
  });
  console.log(data);
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
            time: time,
            variable: mod,
            value: "nan",
          });
        } else {
          // if found data point, impute with the value of the data point
          imputedData.push(temp[0]);
        }
      } else {
        // if found data point, impute with the value of the data point
        imputedData.push(temp[0]);
      }
    }
  }
  return imputedData;
}

var data2;
var dd;
d3.csv("unemp.csv", { typed: true }).then((data) => {
  dd = data;
  data2 = ffill(dd);

  // chart = StackedAreaChart(data, {
  //   x: (d) => new Date(d.date),
  //   y: (d) => d.unemployed,
  //   z: (d) => d.industry,
  //   yLabel: "↑ Unemployed persons",
  //   width: 800,
  //   height: 500,
  // });

  // d3.select("body").append(chart);
});
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
          });
        } else {
          // if found data point, impute with the value of the data point
          // temp[0][n_val] =
          //   Math.abs(temp[0][n_val]) > 1 ? Math.abs(temp[0][n_val]) - 1 : 0;

          // temp[0][n_time] = time;

          //   imputedData.push(temp[0]);

          imputedData.push({
            [n_time]: time,
            [n_val]:
              Math.abs(temp[0][n_val]) > 1 ? Math.abs(temp[0][n_val]) - 1 : 0,
            [n_var]: mod,
          });
        }
      } else {
        // if found data point, impute with the value of the data point
        temp[0][n_val] =
          Math.abs(temp[0][n_val]) > 1 ? Math.abs(temp[0][n_val]) - 1 : 0;
        imputedData.push(temp[0]);
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

var data2;
var dd;
PATH2 = "../resources/test.json";

d3.json(PATH2).then(function (data) {
  // console.log(data);
  // data.forEach((element) => {
  //   element.intime = new Date(element.intime);
  // });
  // return data;
  PAT_ID = 0;
  console.log(PAT_ID);
  console.log(data[PAT_ID]);
  console.log(ffill3(data[PAT_ID]));
  return data[PAT_ID];
});

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

  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const Z = d3.map(data, z);
  console.log(X, Y, Z);

  // Compute default x- and z-domains, and unique the z-domain.
  if (xDomain === undefined) xDomain = d3.extent(X);
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
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  const color = d3.scaleOrdinal(zDomain, colors);
  const xAxis = d3
    .axisBottom(xScale)
    .ticks(width / 80, xFormat)
    .tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 50, yFormat);

  const area = d3
    .area()
    .x(({ i }) => xScale(X[i]))
    .y0(([y1]) => yScale(y1))
    .y1(([, y2]) => yScale(y2));

  const svg = d3
    .create("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("viewBox", [0, 0, width, height])
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg
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

  console.log(series);
  for (let i = 0; i < series.length; i++) {
    // console.log(series[i][0]);
    if (area(series[i]).includes("NaN")) {
      console.log("area is null ", i);
      console.log("area", series[i]);
      console.log(data.filter((d) => d.mod == i));
    }
  }

  svg
    .append("g")
    .selectAll("path")
    .data(series)
    .join("path")
    .attr("fill", ([{ i }]) => color(Z[i]))
    .attr("d", area)
    .append("title")
    .text(([{ i }]) => Z[i]);

  svg
    .append("g")
    .attr("transform", `translate(0,${height - marginBottom})`)
    .call(xAxis);

  return Object.assign(svg.node(), { scales: { color } });
}
