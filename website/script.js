//the basis of this script was found here: https://codepen.io/nearee/pen/zYYENMa

"use strict";
/*[pan and well CSS scrolls]*/
var pnls = document.querySelectorAll('.panel').length,
	scdir, hold = false;

var elements = document.getElementsByClassName('text0')
for(var i = 0; i < elements.length; i++) {
	window.setTimeout(fadein, i*1000, elements[i]);
}

function fadein(textElem) {
	textElem.style.opacity = '1';
}

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
	console.log(slength)
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
/*async function createDiv(){
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
	
}*/

//d3.json('http://localhost:8000/Hojjat-M3/test.json', createChart);


/*function createChart(data) {

	console.log(data)

	/*const parseTime = d3.time.format("%Y-%m-%d %H:%M:%S").parse

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


//d3.csv('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/heatmap_data.csv', createHeatmap);
d3.json('http://localhost:8000/Hojjat-M3/test.json', createHeatmap);


function panel2(data){
	console.log(data)
	let id = Math.floor(Math.random() * data.state.length)
	console.log(id)
	let dict = data.dict_map_states
	console.log(dict)
	let events = data.state[id]
	console.log(events)

	
d3.json('http://localhost:8000/Hojjat-M3/test.json', panel2);


/*
	var margin = {top: 30, right: 30, bottom: 30, left: 30},
	width = 1450 - margin.left - margin.right,
	height = 450 - margin.top - margin.bottom;

	// append the svg object to the body of the page
	var svg = d3.select("#my_dataviz")
	.append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	// Labels of row and columns
	var myGroups = Object.values([...new Set(events.map(item => item.abs_time))])
	var myVars = Object.values([...new Set(events.map(item => item.mod))])
	console.log( myVars)
	// Build X scales and axis:
	var x = d3.scaleBand()
	.range([ 0, width ])
	.domain(myGroups)
	.padding(0.01);
	svg.append("g")
	.attr("transform", "translate(0," + height + ")")
	.call(d3.axisBottom(x))

	// Build X scales and axis:
	var y = d3.scaleBand()
	.range([ height, 0 ])
	.domain(myVars)
	.padding(0.01);
	svg.append("g")
	.call(d3.axisLeft(y));

  // Build color scale
  var myColor = d3
  .scaleLinear()
  .domain([-3, 3])
  .range(['black', 'white'])
  .interpolate(d3.interpolateCubehelix)


	svg.selectAll()
		.data(events, function(d) {return d.mod+':'+d.abs_time;})
		.enter()
		.append("rect")
		.attr("x", function(d) { 
			return x(d.abs_time) 
		})
		.attr("y", function(d) { 
			return y(d.mod) 
		})
		.attr("width", x.bandwidth() )
		.attr("height", y.bandwidth() )
		.style("fill", function(d) { return myColor(d.value)} )


}

function controlFromInput(fromSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromSlider.value = from;
    }
	update(from, to)
}
    
function controlToInput(toSlider, fromInput, toInput, controlSlider) {
    const [from, to] = getParsed(fromInput, toInput);
    fillSlider(fromInput, toInput, '#C6C6C6', '#25daa5', controlSlider);
    setToggleAccessible(toInput);
    if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
    } else {
        toInput.value = from;
    }
	update(from, to)
}

function controlFromSlider(fromSlider, toSlider, fromInput) {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
  if (from > to) {
    fromSlider.value = to;
    fromInput.value = to;
  } else {
    fromInput.value = from;
  }
}

function controlToSlider(fromSlider, toSlider, toInput) {
  const [from, to] = getParsed(fromSlider, toSlider);
  fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
  setToggleAccessible(toSlider);
  if (from <= to) {
    toSlider.value = to;
    toInput.value = to;
  } else {
    toInput.value = from;
    toSlider.value = from;
  }
}

function getParsed(currentFrom, currentTo) {
  const from = parseInt(currentFrom.value, 10);
  const to = parseInt(currentTo.value, 10);
  return [from, to];
}

function fillSlider(from, to, sliderColor, rangeColor, controlSlider) {
    const rangeDistance = to.max-to.min;
    const fromPosition = from.value - to.min;
    const toPosition = to.value - to.min;
    controlSlider.style.background = `linear-gradient(
      to right,
      ${sliderColor} 0%,
      ${sliderColor} ${(fromPosition)/(rangeDistance)*100}%,
      ${rangeColor} ${((fromPosition)/(rangeDistance))*100}%,
      ${rangeColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} ${(toPosition)/(rangeDistance)*100}%, 
      ${sliderColor} 100%)`;
}

function setToggleAccessible(currentTarget) {
  const toSlider = document.querySelector('#toSlider');
  if (Number(currentTarget.value) <= 0 ) {
    toSlider.style.zIndex = 2;
  } else {
    toSlider.style.zIndex = 0;
  }
}

const fromSlider = document.querySelector('#fromSlider');
const toSlider = document.querySelector('#toSlider');
const fromInput = document.querySelector('#fromInput');
const toInput = document.querySelector('#toInput');
fillSlider(fromSlider, toSlider, '#C6C6C6', '#25daa5', toSlider);
setToggleAccessible(toSlider);

fromSlider.oninput = () => controlFromSlider(fromSlider, toSlider, fromInput);
toSlider.oninput = () => controlToSlider(fromSlider, toSlider, toInput);
fromInput.oninput = () => controlFromInput(fromSlider, fromInput, toInput, toSlider);
toInput.oninput = () => controlToInput(toSlider, fromInput, toInput, toSlider);

fromSlider.onmouseup = () => update(getParsed(fromInput, toInput)[0], getParsed(fromInput, toInput)[1]);
toSlider.onmouseup = () => update(getParsed(fromInput, toInput)[0], getParsed(fromInput, toInput)[1]);

function createHeatmap(data) {
	console.log(data)
	let id = Math.floor(Math.random() * data.state.length)
	console.log(id)
	let dict = data.dict_map_states
	console.log(dict)
	let events = data.state[id]
	console.log(events)

	var stateDict = {};
	for(var key in dict){
		stateDict[dict[key]] = key;
	}

	var timeInterval = 1.0
	var eventInDomain = {}
	for(var index in events){
		//console.log(events[index].abs_time)
		var inKey = Math.ceil(events[index].abs_time / timeInterval)
		//console.log(inKey)
		if(inKey in eventInDomain){
			//console.log("oui")
			//console.log(eventInDomain[inKey].length)
			eventInDomain[inKey].push(events[index])
		}
		else{
			eventInDomain[inKey] = [events[index]]
		}
	}
	var unique_time = Object.values([...new Set(events.map(item => item.abs_time))])
	var unique_mod = Object.values([...new Set(events.map(item => item.mod))])
	console.log(eventInDomain)
	
	let min = Math.floor(Math.min(...unique_time))
	let max = Math.ceil(Math.max(...unique_time))
	document.getElementById("fromSlider").setAttribute("min",min)
	document.getElementById("toSlider").setAttribute("min",min)
	document.getElementById("fromSlider").setAttribute("max",max)
	document.getElementById("toSlider").setAttribute("max",max)
	document.getElementById("fromSlider").setAttribute("value",min)
	document.getElementById("toSlider").setAttribute("value",max)
	controlFromSlider(fromSlider, toSlider, fromInput);
	controlToSlider(fromSlider, toSlider, toInput);
}

function update(min, max){
	console.log(min + " " + max)
}*/