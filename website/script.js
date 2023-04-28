//the basis of this script was found here: https://codepen.io/nearee/pen/zYYENMa


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