/**
 * Template Name: MyResume
 * Updated: May 30 2023 with Bootstrap v5.3.0
 * Template URL: https://bootstrapmade.com/free-html-bootstrap-template-my-resume/
 * Author: BootstrapMade.com
 * License: https://bootstrapmade.com/license/
 */
(function () {
  "use strict";

  /**
   * Easy selector helper function
   */
  const select = (el, all = false) => {
    el = el.trim();
    if (all) {
      return [...document.querySelectorAll(el)];
    } else {
      return document.querySelector(el);
    }
  };

  /**
   * Easy event listener function
   */
  const on = (type, el, listener, all = false) => {
    let selectEl = select(el, all);
    if (selectEl) {
      if (all) {
        selectEl.forEach((e) => e.addEventListener(type, listener));
      } else {
        selectEl.addEventListener(type, listener);
      }
    }
  };

  /**
   * Easy on scroll event listener
   */
  const onscroll = (el, listener) => {
    el.addEventListener("scroll", listener);
  };

  /**
   * Navbar links active state on scroll
   */
  let navbarlinks = select("#navbar .scrollto", true);
  const navbarlinksActive = () => {
    let position = window.scrollY + 200;
    navbarlinks.forEach((navbarlink) => {
      if (!navbarlink.hash) return;
      let section = select(navbarlink.hash);
      if (!section) return;
      if (
        position >= section.offsetTop &&
        position <= section.offsetTop + section.offsetHeight
      ) {
        navbarlink.classList.add("active");
      } else {
        navbarlink.classList.remove("active");
      }
    });
  };
  window.addEventListener("load", navbarlinksActive);
  onscroll(document, navbarlinksActive);

  /**
   * Scrolls to an element with header offset
   */
  const scrollto = (el) => {
    let elementPos = select(el).offsetTop;
    window.scrollTo({
      top: elementPos,
      behavior: "smooth",
    });
  };

  /**
   * Back to top button
   */
  let backtotop = select(".back-to-top");
  if (backtotop) {
    const toggleBacktotop = () => {
      if (window.scrollY > 100) {
        backtotop.classList.add("active");
      } else {
        backtotop.classList.remove("active");
      }
    };
    window.addEventListener("load", toggleBacktotop);
    onscroll(document, toggleBacktotop);
  }

  /**
   * Mobile nav toggle
   */
  on("click", ".mobile-nav-toggle", function (e) {
    select("body").classList.toggle("mobile-nav-active");
    this.classList.toggle("bi-list");
    this.classList.toggle("bi-x");
  });

  /**
   * Scrool with ofset on links with a class name .scrollto
   */
  on(
    "click",
    ".scrollto",
    function (e) {
      if (select(this.hash)) {
        e.preventDefault();

        let body = select("body");
        if (body.classList.contains("mobile-nav-active")) {
          body.classList.remove("mobile-nav-active");
          let navbarToggle = select(".mobile-nav-toggle");
          navbarToggle.classList.toggle("bi-list");
          navbarToggle.classList.toggle("bi-x");
        }
        scrollto(this.hash);
      }
    },
    true
  );

  /**
   * Scroll with ofset on page load with hash links in the url
   */
  window.addEventListener("load", () => {
    if (window.location.hash) {
      if (select(window.location.hash)) {
        scrollto(window.location.hash);
      }
    }
  });

  /**
   * Preloader
   */
  let preloader = select("#preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      preloader.remove();
    });
  }

  /**
   * Hero type effect
   */
  const typed = select(".typed");
  if (typed) {
    let typed_strings = typed.getAttribute("data-typed-items");
    typed_strings = typed_strings.split(",");
    new Typed(".typed", {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
    });
  }

  /**
   * Skills animation
   */
  let skilsContent = select(".skills-content");
  if (skilsContent) {
    new Waypoint({
      element: skilsContent,
      offset: "80%",
      handler: function (direction) {
        let progress = select(".progress .progress-bar", true);
        progress.forEach((el) => {
          el.style.width = el.getAttribute("aria-valuenow") + "%";
        });
      },
    });
  }

  /**
   * Porfolio isotope and filter
   */
  window.addEventListener("load", () => {
    let portfolioContainer = select(".portfolio-container");
    if (portfolioContainer) {
      let portfolioIsotope = new Isotope(portfolioContainer, {
        itemSelector: ".portfolio-item",
      });

      let portfolioFilters = select("#portfolio-flters li", true);

      on(
        "click",
        "#portfolio-flters li",
        function (e) {
          e.preventDefault();
          portfolioFilters.forEach(function (el) {
            el.classList.remove("filter-active");
          });
          this.classList.add("filter-active");

          portfolioIsotope.arrange({
            filter: this.getAttribute("data-filter"),
          });
          portfolioIsotope.on("arrangeComplete", function () {
            AOS.refresh();
          });
        },
        true
      );
    }
  });

  /**
   * Initiate portfolio lightbox
   */
  const portfolioLightbox = GLightbox({
    selector: ".portfolio-lightbox",
  });

  /**
   * Initiate portfolio details lightbox
   */
  const portfolioDetailsLightbox = GLightbox({
    selector: ".portfolio-details-lightbox",
    width: "90%",
    height: "90vh",
  });

  /**
   * Portfolio details slider
   */
  new Swiper(".portfolio-details-slider", {
    speed: 400,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  });

  /**
   * Testimonials slider
   */
  new Swiper(".testimonials-slider", {
    speed: 600,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    slidesPerView: "auto",
    pagination: {
      el: ".swiper-pagination",
      type: "bullets",
      clickable: true,
    },
  });

  /**
   * Animation on scroll
   */
  window.addEventListener("load", () => {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out",
      once: true,
      mirror: false,
    });
  });

  /**
   * Initiate Pure Counter
   */
  new PureCounter();
})();

// ADDED BY ME

PATH = "../resources/sepsis1/core/transfers.csv";
PATH = "../resources/tsne_datavis.json";
PATH2 = "../resources/test.json";
PATH_dict = "../resources/dict_map_states.json";
var PAT_ID = 0; // patient id selected from tsne and to be displayed

// loading dictioinary for mapping numbders to state name
var dict_vars;
d3.json(PATH_dict).then((data) => {
  dict_vars = data;
});

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
  // render tsne plot
  [svg_tsne, svg_tsne_legend] = render_scatter_tsne(data, "x", "y", "color", {
    marginTop: 10, // top margin, in pixels
    marginRight: 10, // right margin, in pixels
    marginBottom: 40, // bottom margin, in pixels
    marginLeft: 40, // left margin, in pixels
    width: 400,
    height: 400,
  });

  const div_tsne = d3.select("#scatterplot_tsne_div").text("");
  div_tsne.node().appendChild(svg_tsne);
  const div_tsne_legend = d3.select("#scatterplot_tsne_legend_div").text("");
  div_tsne_legend.node().appendChild(svg_tsne_legend);
});

// This function is called when clicking on points in tsne
function plot_states() {
  d3.json(PATH2)
    .then(function (data) {
      // step 1: return the data for the selected patient
      console.log(PAT_ID, data);

      return data[PAT_ID];
    })
    .then((data) => {
      console.log("EEEE", data);
      // step 2: render plots for the specific patient

      // remove all the previous tooltips
      d3.selectAll(".tooltip-donut").remove();

      // *********************************************************************  check box - to impute
      // we
      d3.select("#chbox_impute").on("change", function () {
        if (this.checked) {
          // impute the data and keep it in new_data

          selectedValue = d3.select("#slider_scatter_state").attr("value");
          new_data = ffill3(data, 0, (compute_abs = false));
        } else {
          // keep the original data (unimputed)

          new_data = data;
        }
        // scatter plot for states
        [svg_scatter, svg_scatter_legend, svg_att_legend] =
          render_scatter_states(
            new_data,
            "abs_time",
            "mod",
            "value",
            (att = "att"),
            {
              marginTop: 20, // top margin, in pixels
              marginRight: 20, // right margin, in pixels
              marginBottom: 60, // bottom margin, in pixels
              marginLeft: 100, // left margin, in pixels
              width: 900,
              height: 450,
              rect_dim: 10,
            }
          );

        // clear div and add the svg to the div
        const div_state_scatter = d3.select("#scatterplot_states_div").text("");
        div_state_scatter.node().appendChild(svg_scatter);

        // legend for states
        const div_state_scatter_legend = d3
          .select("#scatterplot_states_legend_div")
          .text("");
        div_state_scatter_legend.node().appendChild(svg_scatter_legend);

        // legend for attention
        const div_att_scatter_legend = d3
          .select("#scatterplot_att_legend_div")
          .text("");
        div_att_scatter_legend.node().appendChild(svg_att_legend);
      });
      // ************************** scatterplot for states **************************
      const rect_dim = 10; // dimension of the rectangles in pixels
      [svg_scatter, svg_scatter_legend, svg_att_legend] = render_scatter_states(
        data,
        "abs_time",
        "mod",
        "value",
        (att = "att"),
        {
          marginTop: 20, // top margin, in pixels
          marginRight: 20, // right margin, in pixels
          marginBottom: 60, // bottom margin, in pixels
          marginLeft: 100, // left margin, in pixels
          width: 900,
          height: 450,
          rect_dim: 10,
        }
      );

      // clear div and add the svg to the div
      const div_state_scatter = d3.select("#scatterplot_states_div").text("");
      div_state_scatter.node().appendChild(svg_scatter);

      // legend for states
      const div_state_scatter_legend = d3
        .select("#scatterplot_states_legend_div")
        .text("");
      div_state_scatter_legend.node().appendChild(svg_scatter_legend);

      // legend for attention
      const div_att_scatter_legend = d3
        .select("#scatterplot_att_legend_div")
        .text("");
      div_att_scatter_legend.node().appendChild(svg_att_legend);

      // ************************** stacked area chart **************************
      [svg_stack, svg_stack_legend] = render_stackedArea(data, {
        x: (d) => d.abs_time,
        y: (d) => d.value,
        z: (d) => d.mod,
        yLabel: "↑ Unemployed persons",
        marginTop: 20, // top margin, in pixels
        marginRight: 20, // right margin, in pixels
        marginBottom: 60, // bottom margin, in pixels
        marginLeft: 100, // left margin, in pixels
        width: 900,
        height: 450,
        rect_dim: 10, // specifies the width hline
        xType: d3.scaleLinear,
      });

      // clear div and add the svg to the div
      const div_stackedchart = d3.select("#stackedchart").text("");
      div_stackedchart.node().appendChild(svg_stack);

      // add legend
      const stackedarea_legend_div = d3
        .select("#stackedarea_legend_div")
        .text("");
      stackedarea_legend_div.node().appendChild(svg_stack_legend);
    });
}

const orig_dict = {
  1: "HR",
  2: "DBP",
  3: "MAP",
  4: "SBP",
  5: "Resp",
  6: "Temp",
  7: "O2Sat",
  8: "BUN",
  9: "Creatinine",
  10: "Glucose",
  11: "HCO3",
  12: "Potassium",
  13: "Magnesium",
  14: "Hct",
  15: "Platelets",
  16: "WBC",
  17: "FiO2",
  18: "PaCO2",
  19: "pH",
  20: "SaO2",
  21: "Alkalinephos",
  22: "AST",
  23: "Bilirubin_total",
  24: "Bilirubin_direct",
  25: "Lactate",
  26: "TroponinI",
  27: "Hgb",
  28: "Chloride",
  29: "Phosphate",
  30: "Calcium",
  31: "PTT",
  32: "Fibrinogen",
};
// let dict = orig_dict;

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
  dict = {};
  for (let i = 0; i < values_argsorted.length; ++i) {
    dict[values_argsorted.length - i] = orig_dict[values_argsorted[i]];
  }
  return values_argsorted;
}

function reorderMods(min, max, mod, mods_argsorted) {
  for (let i = 0; i <= max - min; ++i) {
    if (mod == mods_argsorted[i]) {
      return max + min - i - 1;
    }
  }
}

function ffill3(data, selectedValue = 1, compute_abs = true) {
  console.log("ffill3", selectedValue);
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
          // if again no data point, impute with 0
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
            Math.abs(temp[temp.length - 1][n_val]) > selectedValue
              ? Math.abs(temp[temp.length - 1][n_val]) - selectedValue
              : 0;
          // val2save = temp[temp.length - 1][n_val];
          imputedData.push({
            [n_time]: time,
            [n_val]: val2save * Math.sign(temp[temp.length - 1][n_val]),

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
          Math.abs(temp[temp.length - 1][n_val]) > selectedValue
            ? Math.abs(temp[temp.length - 1][n_val]) - selectedValue
            : 0;
        // val2save = temp[temp.length - 1][n_val];
        imputedData.push({
          [n_time]: time,
          [n_val]: val2save * Math.sign(temp[temp.length - 1][n_val]),
          [n_var]: mod,
          att: temp[temp.length - 1]["att"],
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

  if (compute_abs) {
    // step 5: compute absolute value
    for (i = 0; i < imputedData.length; i++) {
      if (imputedData[i][n_val] < 0) {
        imputedData[i][n_val] = Math.abs(imputedData[i][n_val]);
      }
    }
  }
  return imputedData;
}

function render_scatter_tsne(
  data,
  X_field,
  Y_field,
  color_field,
  {
    marginTop = 20, // top margin, in pixels
    marginRight = 20, // right margin, in pixels
    marginBottom = 60, // bottom margin, in pixels
    marginLeft = 60, // left margin, in pixels
    width = 900,
    height = 450,
  }
) {
  var margin = {
    top: marginTop,
    right: marginRight,
    bottom: marginBottom,
    left: marginLeft,
  };
  const rad_circle = 6;
  let currentZoom = 1;
  dict = orig_dict;
  // Extract the variables from the data
  var ys = data.map((d) => +d[Y_field]);
  var xs = data.map((d) => +d[X_field]);
  var names = data.map((d) => d[color_field]);
  names = ["Positive", "Negative"];

  // var tooltip = d3.select(".tooltip").style("opacity", 0);

  const svg_holder = d3
    .create("svg")
    .attr("id", "scatterplot_tsne")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom);

  // Set up the plot
  var scatterplot = svg_holder
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const zoomable_g = scatterplot.append("g").attr("id", "zoomable_g");

  var xScale = d3
    .scaleLinear()
    .domain([d3.min(xs) - 5, d3.max(xs) + 5])
    .range([0, width]);
  // var xScale = d3.scaleTime().domain([new Date("2100-01-01"), new Date("2200-01-05")]).range([0, width]);
  var yScale = d3
    .scaleLinear()
    .domain([d3.min(ys) - 5, d3.max(ys) + 5])
    .range([height, 0]);
  var colorScale = d3.scaleOrdinal().domain(names).range(d3.schemeCategory10);

  render_legend_tsne(colorScale);

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
    .attr("id", "tooltip-tsne")
    .style("opacity", 0);

  zoomable_rect = scatterplot
    .append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "red")
    .style("pointer-events", "all")
    .attr("opacity", 0.1);

  // ################################################ create a legend
  var svg_tsne_legend = d3
    .create("svg")
    .attr("id", "svg_tsne_legend")
    .attr("width", 200)
    .attr("height", 100)
    .style("border", "1px solid black");

  // Append the SVG element to the DOM
  d3.select("body").append(() => svg_tsne_legend.node());

  console.log("LEG", colorScale.domain());

  // Use the detached SVG element to create circles
  svg_tsne_legend
    .selectAll("circle")
    .data(colorScale.domain())
    .enter()
    .append("circle")
    .attr("cx", 10)
    .attr("cy", (d, i) => i * 25 + 25)
    .attr("r", rad_circle)
    .attr("fill", (d) => colorScale(d));

  svg_tsne_legend
    .selectAll("circle2")
    .data(["False Predictions"])
    .enter()
    .append("circle")
    .attr("cx", 10)
    .attr("cy", (d, i) => 2 * 25 + 25)
    .attr("r", rad_circle + 2)
    .attr("stroke", "red")
    .attr("fill", "none");
  // Add one label in the legend for each name.
  svg_tsne_legend
    .selectAll("mylabels")
    .data(["Positive", "Negative", "False Predictions"])
    .enter()
    .append("text")
    .attr("x", 30)
    .attr("y", function (d, i) {
      return 25 + i * 25;
    }) // 100 is where the first dot appears. 25 is the distance between dots
    .style("fill", "black")
    .text(function (d) {
      return d;
    })
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle");
  // ################################################ END create a legend

  // Add the points (False predictions)

  scatterplot
    .append("g")
    .attr("class", "tsne_allPoints")
    .selectAll(".tsne_point_false")
    .data(data.filter((d) => d.color.includes("False")))
    .enter()
    .append("circle")
    .attr("class", "tsne_point_false")
    .attr("cx", function (d) {
      return xScale(d[X_field]);
    })
    .attr("cy", function (d) {
      return yScale(d[Y_field]);
    })
    .attr("r", (rad_circle + 2) / currentZoom)
    .attr("stroke", "red")
    .attr("fill", "none");

  // Add the points (True and Negative samples)

  allPoints = scatterplot
    .append("g")
    .attr("class", "tsne_allPoints")
    .selectAll(".tsne_point")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "tsne_point")
    .attr("cx", function (d) {
      return xScale(d[X_field]);
    })
    .attr("cy", function (d) {
      return yScale(d[Y_field]);
    })
    .attr("r", rad_circle / currentZoom)
    .attr("fill", function (d) {
      return d.color.includes("True Positives") ||
        d.color.includes("False Negatives")
        ? colorScale("Positive")
        : colorScale("Negative");
    })
    .on("mouseover", function (event, d) {
      i = 0;

      console.log("tsne HOVER", i);

      d3.select(this)
        .transition()
        .duration("50")
        .attr("stroke", "black")
        .attr("r", (rad_circle + 1) / currentZoom);
      //Makes the new div appear on hover:
      //   divToolTip.transition().duration(50).style("opacity", 1);

      // let num = `${X_field}: ${d[X_field]} <br> ${Y_field}: ${d[Y_field]} <br> ${color_field}: ${d[color_field]}`;
      let num = `${d[color_field]}`;

      console.log("tooltip", num, event.pageX, event.pageY);
      divToolTip
        .html(num)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 15 + "px")
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
        .attr("stroke", "none")
        .attr("r", rad_circle / currentZoom);
      //Makes the new div disappear:
      divToolTip.transition().duration(50).style("opacity", 0);
    })
    .on("click", function (event, d) {
      console.log("CLICK", d3.pointer(event));

      PAT_ID = d3.selectAll("circle").nodes().indexOf(this);

      // go to the scatter panel

      plot_states();

      setTimeout(() => {
        document
          .getElementById("Scatter_panel")
          .scrollIntoView({ behavior: "smooth" });
      }, 1500);
    });
  // Add zoom functionality
  zoomable_rect.call(
    d3
      .zoom()
      .extent([
        [margin.left, margin.top],
        [width, height],
      ])
      .scaleExtent([1 / 2, 8])
      .on("zoom", function (event) {
        currentZoom = event.transform.k;

        scatterplot
          .selectAll(".tsne_allPoints")
          .attr("transform", event.transform);

        scatterplot
          .selectAll(".tsne_point")
          .transition()
          .duration(50)
          .attr("r", rad_circle / currentZoom);

        scatterplot
          .selectAll(".tsne_point_false")
          .transition()
          .duration(50)
          .attr("r", (rad_circle + 2) / currentZoom);

        // recover the new scale
        var newX = event.transform.rescaleX(xScale);
        var newY = event.transform.rescaleY(yScale);

        // yScale.domain(d3.event.transform.rescaleY(yScale).domain());
        console.log("Zooming AFTER", newX.domain(), newY.domain());
        console.log(currentZoom);

        // update axis
        xAxis.scale(newX);
        scatterplot.select(".x-axis").call(xAxis);
        yAxis.scale(newY);
        scatterplot.select(".y-axis").call(yAxis);
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

  // scatterplot.append("g").attr("class", "brush").call(brush);

  // A function that set idleTimeOut to null
  var idleTimeout;
  function idled() {
    idleTimeout = null;
  }

  // A function that update the chart for given boundaries
  function updateChart(event) {
    extent = event.selection;

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

  return [svg_holder.node(), svg_tsne_legend.node()];
}

function render_scatter_states(
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
  let currentZoom = 1;
  const att_scale = 1.5;
  console.log("QQQQ", data.slice(0, 10));

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
    .domain([0, Object.keys(dict_vars).length + 1])
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
  var yAxis = d3
    .axisLeft()
    .scale(yScale)
    .tickFormat(function (d) {
      if (d == 0) return "";
      if (d == Object.keys(dict_vars).length + 1) return "";
      return dict_vars[d - 1];
    })
    .ticks(32);

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
      // console.log(d[X_field], d[Y_field], yScale(d[Y_field] + 1));
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
        return -(rect_dim * att_scale) / 2;
      })
      .attr("y", function (d) {
        return -(rect_dim * att_scale) / 2;
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
      return -rect_dim / 2;
    })
    .attr("y", function (d) {
      return -rect_dim / 2;
    })
    .attr("width", (rect_dim / currentZoom) * 1)
    .attr("height", (rect_dim / currentZoom) * 1)
    .attr("fill", function (d) {
      return colorScale(d[color_field]);
    });

  console.log("ALL POINTS", allPoints);

  // *********************************************************************  SLIDER
  d3.select("#slider_scatter_state").on("change", function (d) {
    selectedValue = this.value;
    d3.select("#slider_state_text").text(
      "`" + "|value|>" + selectedValue + " \\sigma" + "`"
      // `abs(value-mean)>${selectedValue} S.D and`
    );
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "slider_state_text"]); // Render MathJax equation

    // data2 = data.map((d) => {
    //   d.value = 2;
    //   return d;
    // });
    new_data = data.map((d) => {
      return {
        ...d, // Shallow cloning each object in the array
        value:
          Math.abs(d.value) > selectedValue
            ? (Math.abs(d.value) - selectedValue) * Math.sign(d.value)
            : 0,
      };
    });

    console.log("selectedValue", selectedValue, data);
    d3.selectAll(".point_val")
      .data(new_data)
      .transition()
      .duration(500)
      .attr("fill", function (d) {
        return colorScale(d[color_field]);
      });
  });

  // // *********************************************************************  check boxe - to impute

  // d3.select("#chbox_impute").on("change", function () {
  //   if (this.checked) {
  //     // do this

  //     selectedValue = d3.select("#slider_scatter_state").attr("value");
  //     new_data = ffill3(data, 0, (compute_abs = false));

  //     console.log("checked");
  //   } else {
  //     // do that
  //     console.log("not checked");

  //     new_data = data;
  //   }

  //   console.log("QQQ", new_data.length, data.length, new_data);
  //   // g_all = d3.selectAll(".g_allpoints");
  //   // g_all
  //   //   .selectAll(".g_point")
  //   //   .data(new_data)
  //   //   .join(
  //   //     (enter) =>
  //   //       enter
  //   //         .append("g")
  //   //         .attr("class", "g_point")
  //   //         .attr("transform", function (d) {
  //   //           return `translate(${xScale(d[X_field])},${yScale(d[Y_field])})`;
  //   //         })
  //   //         .append("rect")
  //   //         .attr("class", "point_val")
  //   //         .transition()
  //   //         .duration(500)
  //   //         .attr("x", function (d) {
  //   //           return xScale(d[X_field]) * 0 - rect_dim / 2;
  //   //         })
  //   //         .attr("y", function (d) {
  //   //           return yScale(d[Y_field]) * 0 - rect_dim / 2;
  //   //         })
  //   //         .attr("width", (rect_dim / currentZoom) * 1)
  //   //         .attr("height", (rect_dim / currentZoom) * 1)
  //   //         .attr("stroke", "black")
  //   //         .attr("fill", function (d) {
  //   //           return colorScale(d[color_field]);
  //   //         }),
  //   //     (update) =>
  //   //       update
  //   //         .transition()
  //   //         .duration(500)
  //   //         .attr("fill", function (d) {
  //   //           return colorScale(d[color_field]);
  //   //         }),
  //   //     (exit) => exit.transition().duration(500).remove()
  //   //   );
  //   // Store the value or perform any other action based on the checkbox state
  // });
  // *********************************************************************  Variable re-ordering
  allPoints.on("click", function (event, d) {
    var time = d[X_field];
    var mods_sorted = argsort_values(data, time, d3.extent(ys));
    console.log(
      "mods_sorted",
      mods_sorted,
      mods_sorted.map((d) => dict_vars[d - 1]),
      dict_vars
    );
    yAxis
      .tickFormat(function (d) {
        temp2 = reorderMods(
          d3.extent(ys)[0],
          d3.extent(ys)[1],
          d + 1,
          mods_sorted
        );
        console.log(
          "mods_sorted3",
          d,
          // dict_vars[d],
          // temp2 - 1,
          // dict_vars[temp2 - 1],
          // mods_sorted,
          mods_sorted.length - d - 1,
          mods_sorted[mods_sorted.length - d - 1],
          dict_vars[mods_sorted[mods_sorted.length - d - 1] - 1]
          // mods_sorted
        );

        if (d == 0) return "";
        if (d == Object.keys(dict_vars).length + 1) return "";
        return dict_vars[mods_sorted[mods_sorted.length - d] - 1];
      })
      .ticks(Object.keys(dict_vars).length);
    scatterplot.select(".y-axis").call(yAxis);
    allPoints
      .transition()
      .duration(500)
      .attr("transform", function (d) {
        temp = yScale(
          reorderMods(
            d3.extent(ys)[0],
            d3.extent(ys)[1],
            d[Y_field],
            mods_sorted
          )
        );

        return `translate(${xScale(d[X_field])},${temp})`;
      });

    // transition of clicked point only
    d3.select(this).attr("transform", function (d) {
      temp = yScale(
        reorderMods(d3.extent(ys)[0], d3.extent(ys)[1], d[Y_field], mods_sorted)
      );

      return `translate(${xScale(d[X_field])},${temp})`;
    });

    // console.log(
    //   "mods_sorted2",
    //   d3.extent(ys)[0],
    //   d3.extent(ys)[1],
    //   d[Y_field],
    //   mods_sorted,
    //   reorderMods(d3.extent(ys)[0], d3.extent(ys)[1], 2, mods_sorted)
    // );

    // var time = d[X_field];
    // var mods_sorted = argsort_values(data, time, d3.extent(ys));
    // console.log(
    //   "mods_sorted",
    //   mods_sorted,
    //   mods_sorted.map((d) => dict_vars[d - 1])
    // );
    // // yAxis
    // //   .tickFormat(function (d) {
    // //     return dict_vars[d - 1];
    // //   })
    // //   .ticks(Object.keys(dict_vars).length);
    // // scatterplot.select(".y-axis").call(yAxis);
    // allPoints.attr("transform", function (d) {
    //   temp = yScale(
    //     reorderMods(d3.extent(ys)[0], d3.extent(ys)[1], d[Y_field], mods_sorted)
    //   );

    //   return `translate(${xScale(d[X_field])},${temp})`;
    // });
  });

  // *********************************************************************  Hover Line

  // Create the hover line
  const g_hoverlines = scatterplot.append("g").attr("class", "hover-lines");
  g_hoverlines
    .append("rect")
    .attr("class", "hline")
    .attr("height", rect_dim)
    .attr("width", width)
    .style("pointer-events", "none")
    .attr("opacity", "0.1");

  g_hoverlines
    .append("rect")
    .attr("class", "vline")
    .attr("width", rect_dim)
    .attr("height", height)
    .style("pointer-events", "none")
    .attr("opacity", "0.1");
  // *********************************************************************  TOOLTIP
  allPoints
    .on("mouseover", function (event, d) {
      console.log("HOVER");
      // d3.selectAll(".g_point").transition().duration(50).attr("width", 100);
      d3.select(this).transition().duration(50).attr("fill", "black");

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
        .attr("height", (1.5 * rect_dim) / currentZoom)
        .attr("fill", "black");

      //Makes the new div appear on hover:
      //   divToolTip.transition().duration(50).style("opacity", 1);

      // let num = `${X_field}: ${d[X_field]} <br> ${Y_field}: ${d[Y_field]} <br> ${color_field}: ${d[color_field]}`;
      let num = `time: ${d3.format(".1f")(d[X_field])} h <br> Variable: ${
        dict_vars[d[Y_field] - 1]
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

  // ################################################ Render legend

  // Define the dimensions of the color bar
  var barWidth = 200;
  var barHeight = 20;

  // Create an SVG element for the color bar
  var svg_states_legend = d3
    .select("body")
    .append("svg")
    .attr("width", barWidth)
    .attr("height", barHeight * 2);
  // .style("border", "1px solid black");

  // Create a linear gradient for the color scale
  var gradient = svg_states_legend
    .append("defs")
    .append("linearGradient")
    .attr("id", "colorGradient")
    .attr("x1", "0%")
    .attr("x2", "100%");

  // Add color stops to the gradient
  gradient
    .selectAll("stop")
    .data(colorScale.range())
    .enter()
    .append("stop")
    .attr("offset", function (d, i) {
      return (i / (colorScale.range().length - 1)) * 100 + "%";
    })
    .attr("stop-color", function (d) {
      return d;
    });

  // Render the color bar
  svg_states_legend
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", barWidth)
    .attr("height", barHeight)
    .style("fill", "url(#colorGradient)");

  // add text
  svg_states_legend
    .append("text")
    .attr("x", 0)
    .attr("y", barHeight)
    .text("Low")
    .style("font-size", "15px")
    .attr("alignment-baseline", "hanging");
  svg_states_legend
    .append("text")
    .attr("x", barWidth - 35)
    .attr("y", barHeight)
    .text("High")
    .style("font-size", "15px")
    .attr("alignment-baseline", "hanging");
  // ################################################ end Render legend

  // ################################################ Render legend for attention

  const colorScale_att = d3
    .scaleLinear()
    .domain([-2, 2])
    .range(["white", "green"])
    .interpolate(d3.interpolateRgb);

  // Create an SVG element for the color bar
  var svg_att_legend = d3
    .select("body")
    .append("svg")
    .attr("width", barWidth)
    .attr("height", barHeight * 2);
  // .style("border", "1px solid black");

  // Create a linear gradient for the color scale
  var gradient = svg_att_legend
    .append("defs")
    .append("linearGradient")
    .attr("id", "colorGradient2")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

  gradient
    .append("stop")
    .attr("offset", "0%")
    .attr("stop-color", colorScale_att(-2));

  gradient
    .append("stop")
    .attr("offset", "100%")
    .attr("stop-color", colorScale_att(2));

  // Render the color bar
  svg_att_legend
    .append("rect")
    .attr("width", barWidth)
    .attr("height", barHeight)
    .style("fill", "url(#colorGradient2)");

  return [svg_holder.node(), svg_states_legend.node(), svg_att_legend.node()];
}

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/stacked-area-chart
function render_stackedArea(
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
  let data_filled = ffill3(data, 1);
  // data_filled = data;
  console.log("HIIIIIIIIIIIIIIIII");
  // Compute values.
  data_filled.forEach((d) => {
    d.value = d.value + 0.000001;
  });
  const X = d3.map(data_filled, x);
  let Y = d3.map(data_filled, y);
  const Z = d3.map(data_filled, z);
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
  let series = d3
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
  let yScale = yType(yDomain, yRange);
  const color = d3.scaleOrdinal(zDomain, colors);
  console.log("COLOR", color.domain(), color.range());
  const xAxis = d3.axisBottom(xScale);
  // .ticks(width / 80, xFormat);
  // .tickSizeOuter(0)
  let yAxis = d3.axisLeft(yScale).ticks(height / 50, yFormat);
  let area = d3
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
    );
  // .call((g) =>
  //   g
  //     .append("text")
  //     .attr("x", -marginLeft)
  //     .attr("y", 10)
  //     .attr("fill", "currentColor")
  //     .attr("text-anchor", "start")
  //     .text(yLabel)
  // );

  // stackedchart
  //   .append("g")
  //   .attr("class", "x-axis")
  //   .attr("transform", `translate(0,${height})`)
  //   .call(xAxis);

  g_zoomable = stackedchart.append("g").attr("id", "stack_zoomable");

  // adding area
  area_g = g_zoomable
    .append("g")
    .selectAll("path")
    .data(series)
    .join("path")
    .attr("fill", ([{ i }]) => color(Z[i]))
    .attr("d", area)
    .attr("opacity", 0.5);
  // area_g.append("title").text(([{ i }]) => Z[i]);

  // ********** update if slider changes **********

  // Create the hover line
  g_zoomable
    .append("rect")
    .attr("class", "vline")
    .style("pointer-events", "none")
    .attr("width", rect_dim);

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
      d3.select(this).attr("opacity", 1);
      const x_shift = d3.pointer(event)[0];
      console.log(
        "stackedchart mouseover",
        x_shift,
        d,
        selected_id,
        selected_mod,
        Y[selected_id],
        X[selected_id],
        X,
        Y,
        Z
      );

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
      temp_text = dict_vars[selected_mod - 1];
      tooltip
        .html(temp_text)
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY - 15 + "px")
        .transition()
        .duration(200)
        .style("opacity", 1);
    })
    .on("mouseout", function (event, d) {
      d3.select(this).attr("opacity", 0.5);
      d3.selectAll(".hover-line").attr("opacity", 0);

      // hide tooltip
      // show tooltip
      tooltip.transition().duration(50).style("opacity", 0);
    });

  svg_hoder.attr("id", "stackedchart_svg");

  d3.select("#slider_stackedAreaChart").on("change", function (d) {
    selectedValue = this.value;
    console.log("SLIDER");
    d3.select("#slider_area_text").text(
      // `abnormality(value) = abs(value)- ${selectedValue} S.D`

      "`" +
        "\\text{abnormality(value)}=" +
        "|value|-" +
        selectedValue +
        " \\sigma" +
        "`"
    );
    MathJax.Hub.Queue(["Typeset", MathJax.Hub, "slider_area_text"]); //

    data_filled = ffill3(data, selectedValue);
    data_filled.forEach((d) => {
      d.value = d.value + 0.000001;
    });

    console.log(
      "qwer",
      data.filter((d) => Math.abs(d.value) > selectedValue),
      data_filled.filter((d) => Math.abs(d.value) > 0.001),
      data.length,
      data_filled.length,
      selectedValue
    );
    update_stacked_area(data_filled);
  });

  function update_stacked_area(new_data) {
    Y = d3.map(new_data, y);

    series = d3
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

    yDomain = d3.extent(series.flat(2));
    yDomain = [d3.min(series.flat(2)), d3.max([0.5, d3.max(series.flat(2))])];
    yScale = yType(yDomain, yRange);

    yAxis = d3.axisLeft(yScale).ticks(height / 50, yFormat);
    stackedchart.select(".y-axis").transition().duration(500).call(yAxis);

    area = d3
      .area()
      .x(({ i }) => xScale(X[i]))
      .y0(([y1]) => yScale(y1))
      .y1(([, y2]) => yScale(y2));

    // join

    area_g = g_zoomable
      .selectAll("path")
      .data(series)
      .join(
        (enter) =>
          enter
            .append("path")
            .attr("fill", ([{ i }]) => color(Z[i]))
            .attr("opacity", 0.5)
            .transition()
            .duration(500)
            .attr("d", area),
        (update) =>
          update
            .attr("fill", ([{ i }]) => color(Z[i]))
            .attr("opacity", 0.5)
            .transition()
            .duration(500)
            .attr("d", area),
        (exit) => exit.transition().duration(500).remove()
      );
  }

  // ############################################### Create Legend ###############################################
  const legendData = color.domain().map((d, i) => {
    return {
      label: dict_vars[d],
      color: color(i),
    };
  });

  console.log("legendData", zDomain, color.domain(), color.range(), legendData);
  const legend = d3.create("svg").attr("width", 150).attr("height", 200);
  d3.select("body").append(() => legend.node());

  const legendItems = legend
    .selectAll("g")
    .data(legendData)
    .enter()
    .append("g")
    .attr("transform", (d, i) => `translate(0, ${i * 20})`);

  legendItems
    .append("rect")
    .attr("width", 20)
    .attr("height", 20)
    .attr("fill", (d) => d.color);

  legendItems
    .append("text")
    .attr("x", 30)
    .attr("y", 15)
    .text((d) => d.label);

  // ############################################### end Create Legend ###############################################
  console.log("legendData", legend.node());

  return [
    Object.assign(svg_hoder.node(), { scales: { color } }),
    legend.node(),
  ];
}
