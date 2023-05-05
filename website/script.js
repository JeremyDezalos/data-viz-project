//the basis of this script was found here: https://codepen.io/nearee/pen/zYYENMa


"use strict";
/*[pan and well CSS scrolls]*/
var pnls = document.querySelectorAll('.panel').length,
	scdir, hold = false;

function _scrollY(obj) {
	//block scrolling when in the new panel
	if(!canCreatePanel){return;}
	var slength, plength, pan, step = 100,
		vh = window.innerHeight / 100,
		vmin = Math.min(window.innerHeight, window.innerWidth) / 100;
	if ((this !== undefined && this.id === 'well') || (obj !== undefined && obj.id === 'well')) {
		pan = this || obj;
		plength = parseInt(pan.offsetHeight / vh);
	}
	if (pan === undefined) {
		return;
	}
	console.log(pan)
	plength = plength || parseInt(pan.offsetHeight / vmin);
	slength = parseInt(pan.style.transform.replace('translateY(', ''));
	//compute # pixels to scroll
	if (scdir === 'down' && Math.abs(slength) < (plength - plength / pnls)) {
		slength = slength - step;
	} else if (scdir === 'up' && slength < 0) {
		slength = slength + step;
	} else if (scdir === 'top') {
		slength = 0;
	}
	//debounce wheel
	if (hold === false) {
		hold = true;
		//scroll
		pan.style.transform = 'translateY(' + slength + 'vh)';
		setTimeout(function() {
			hold = false;
		}, 1000);
	}
	//console.log(scdir + ':' + slength + ':' + plength + ':' + (plength - plength / pnls));
}

/*[assignments]*/
var well = document.getElementById('well');
well.style.transform = 'translateY(0)';
well.addEventListener('wheel', function(e) {
	if (e.deltaY < 0) {
		scdir = 'up';
	}
	if (e.deltaY > 0) {
		scdir = 'down';
	}
	e.stopPropagation();
});
well.addEventListener('wheel', _scrollY);
var tops = document.querySelectorAll('.top');
for (var i = 0; i < tops.length; i++) {
	tops[i].addEventListener('click', function() {
		scdir = 'top';
		_scrollY(well);
	});
}

//when re-loading the page, scroll to the top
window.onbeforeunload = function () {
	window.scrollTo(0, 0);
}


var canCreatePanel = true;
//create a panel
async function createDiv(){
	//can create only one panel
	if(!canCreatePanel){return;}
	var divReference = document.getElementById('divCreator');
	var divToCreate = document.createElement('div');
	divToCreate.classList.add('panel');
	divToCreate.setAttribute('id', 'panelToDelete');
	divToCreate.innerHTML = "Lots of data for the patient !!!";
	let func = "destroy('panelToDelete')"
	divToCreate.innerHTML += '<br/><button onclick='+ func +'>Go back</button>';
	divReference.parentNode.appendChild(divToCreate);
	
	//scroll down
	scdir = 'down';
	_scrollY(well);
	canCreatePanel = false;
	//let the animation play
	await new Promise(resolve => setTimeout(resolve, 1000));
}


//destroy a created panel
async function destroy(elem){
	canCreatePanel = true;
	//set the destination to top
	scdir = 'top';
	_scrollY(well);
	let d = document.getElementById(elem);
	const node = document.createTextNode("Go down");
	d.parentNode.firstElementChild.appendChild(node);
	//let the animation play
	await new Promise(resolve => setTimeout(resolve, 1000));
	
	
	
	d.parentNode.removeChild(d);
	
}


//Use as example: https://d3-graph-gallery.com/graph/barplot_horizontal.html
// set the dimensions and margins of the graph
var margin = {top: 20, right: 30, bottom: 40, left: 90},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("#divCreator")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv('http://localhost:8000/resources/data1/core/transfers.csv', createChart);

function createChart(data) {

	const parseTime = d3.time.format("%Y-%m-%d %H:%M:%S").parse

	var filtered_data = data.filter(d => {
		return d.careunit != ""
	});

	filtered_data = filtered_data.sort((a,b) => {
		return +a.subject_id - +b.subject_id
	});

	var subject_id_col = d3.map(filtered_data, d => {
		return(d.subject_id)
	}).keys();

	const random_subject_index = Math.floor(Math.random() * subject_id_col.length);

	filtered_data = filtered_data.filter(d => {
		return d.subject_id == subject_id_col[random_subject_index]
	});

	filtered_data = d3.map(filtered_data, d => {
		return([d.careunit, (parseTime(d.outtime) - parseTime(d.intime)) / 1000])
	}).keys();

	var acc = 0; //Contains all time value
	const wards = new Map();
	for(var d in filtered_data){
		var name = filtered_data[d].split(",")[0]
		var time_value = parseInt(filtered_data[d].split(",")[1])
		acc += time_value
		if(wards.has(name)){
			var old_value = wards.get(name)
			time_value += old_value
			wards.set(name, time_value)
		}
		else{
			wards.set(name, time_value)
		}
	}

	const arr = Array.from(wards, function (entry) {
		return { key: entry[0], value: entry[1] };
	});
	  
	// Add X axis
	var x = d3.scaleLinear()
	  .domain([0, 100])
	  .range([0, width]);

	function randomColor(){
		var color = "#"
		for(let j = 0; j < 6; ++j){
			color = color + Math.floor(Math.random() * 10)
		}
		return color
	}

	var total_x = 0;
	svg.selectAll("myRect")
	.data(arr)
	.enter()
	.append("rect")
	.on("click", function(d) {
		createDiv()
	})
	.attr("id", function(d) {
		return d.key
	})
	.attr("x", function(d) { 
		total_x += x((d.value/acc)*100)
		return total_x - x((d.value/acc)*100)
	})
	.attr("y", 100)
	.attr("width", function(d) {
		return x((d.value/acc)*100); })
	.attr("height", 100)
	.attr("fill", function(d) {
		return randomColor()
	})
}