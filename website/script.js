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

//d3.json('http://localhost:8000/Hojjat-M3/test.json', createChart);


function createChart(data) {

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
	})*/
}


d3.json('http://localhost:8000/Hojjat-M3/test.json', panel2);

function panel2(data){
	console.log(data)
	var id = Math.floor(Math.random() * data.state.length)
	console.log(id)
	var dict = data.dict_map_states
	console.log(dict)
	var events = data.state[id]
	var output = []
	for(var i = 0; i < events.length; ++i){
		var event = events[i]
		output[i] = [event.abs_time, event.mod, event.value]
		
		
	}
	//time, mod, value
	console.log(output)
}