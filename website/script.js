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