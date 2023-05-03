//the basis of this script was found here: https://codepen.io/nearee/pen/zYYENMa


d3.csv('http://localhost:8000/resources/data1/core/transfers.csv', createChart);
//var data = d3.csv.parseRows('localhost:8000/resources/data1/core/transfers.csv');
//console.log(data)
//createChart(data)

function createChart(data) {
	
	//var parseDate = d3.time.format("%Y-%m-%d").parse
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

	var acc = [["", 0]]
	for(d in filtered_data){
		if(acc.includes(d.careunit)){

		}
	}
	//var test = (parseTime(filtered_data[0].outtime) - parseTime(filtered_data[0].intime)) / 1000 //Donne la valeur en seconde

	/*var grouped_by_careunit = d3.flatRollup(
		filtered_data,
		x => ({
		  intime: x.map(d => d.intime),
		  outtime: x.map(d => d.outtime)
		}),
		d => d.careunit
	  );*/
	
	//var grouped_by_careunit = d3.group(filtered_data, d => d.careunit)

	/*filtered_data = d3.map(filtered_data, d => {

	});*/

	console.log(filtered_data)
	/*console.log(parseTime(filtered_data[0].outtime))
	console.log(parseTime(filtered_data[0].intime))*/
}

"use strict";
/*[pan and well CSS scrolls]*/
var pnls = document.querySelectorAll('.panel').length,
	scdir, hold = false;

function _scrollY(obj) {
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
	if (scdir === 'up' && Math.abs(slength) < (plength - plength / pnls)) {
		slength = slength - step;
	} else if (scdir === 'down' && slength < 0) {
		slength = slength + step;
	} else if (scdir === 'top') {
		slength = 0;
	}
	if (hold === false) {
		hold = true;
		pan.style.transform = 'translateY(' + slength + 'vh)';
		setTimeout(function() {
			hold = false;
		}, 1000);
	}
	console.log(scdir + ':' + slength + ':' + plength + ':' + (plength - plength / pnls));
}

/*[assignments]*/
var well = document.getElementById('well');
well.style.transform = 'translateY(0)';
well.addEventListener('wheel', function(e) {
	if (e.deltaY < 0) {
		scdir = 'down';
	}
	if (e.deltaY > 0) {
		scdir = 'up';
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


window.onbeforeunload = function () {
	window.scrollTo(0, 0);
}

var canCreate = true;
async function createDiv(){
	if(canCreate){
		var divReference = document.getElementById('divCreator');
		var divToCreate = document.createElement('div');
		divToCreate.classList.add('panel');
		divToCreate.setAttribute('id', 'panelToDelete');
		divToCreate.innerHTML = "Lots of data for the patient !!!";
		let func = "destroy('panelToDelete')"
		divToCreate.innerHTML += '<br/><button onclick='+ func +'>Remove this</button>';
		divReference.parentNode.appendChild(divToCreate);
		canCreate = false;

		scdir = 'up';
		_scrollY(well);
	
		await new Promise(resolve => setTimeout(resolve, 1000));
	} else {
		alert("Stop being greedy, you can create only one panel.")
	}
}

async function destroy(elem){
	scdir = 'top';
	_scrollY(well);

	await new Promise(resolve => setTimeout(resolve, 1000));
	
	let d = document.getElementById(elem);
	d.parentNode.removeChild(d);
	canCreate = true;
}