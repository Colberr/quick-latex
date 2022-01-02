const brackets = [["\\(", "\\)"], ["\\[", "\\]"], ["$", "$"], ["$$", "$$"], ["", ""]];
var bracketType = 0;
var lastCalledMath = true;

// Code for outputt MathML from JS
let promise = Promise.resolve();
function typeset(code) {
	promise = promise.then(() => { return MathJax.typesetPromise(code()); })
		.catch((err) => console.log('Typeset failed: ' + err.message));
	return promise;
}

// Create element with rendered math inside
function prepareEquation(equation) {
	var element = document.createElement("span");

	typeset(() => {
		element.innerHTML = equation;
	});

	return element;
}

// Updates the outputs
function updateMath(mathInput) {
	// Convert to LATEX and output code
	var latexCode = AMTparseAMtoTeX(mathInput);
	document.getElementById("latex-output").value = brackets[bracketType][0] + latexCode + brackets[bracketType][1];

	// Render the LATEX as an equation and display it
	var element = prepareEquation("\\(" + latexCode + "\\)");
	document.getElementById("math-container").innerHTML = "";
	document.getElementById("math-container").appendChild(element);

	lastCalledMath = true;
}
/*
function updateLATEX(latexInput) {
	// Make copy of textarea value
	var latexCode = latexInput.slice();

	// Strip away brackets if required
	if (latexCode.startsWith(brackets[bracketType][0])) {
		latexCode = latexCode.replace(brackets[bracketType][0], "");
	}
	if (latexCode.endsWith(brackets[bracketType][1])) {
		latexCode = latexCode.replace(brackets[bracketType][1], "");
	}

	// Render the LATEX as an equation and display it
	var element = prepareEquation("\\(" + latexCode + "\\)");
	document.getElementById("math-container").innerHTML = "";
	document.getElementById("math-container").appendChild(element);
	
	lastCalledMath = false;
}
*/

// PRESSING BUTTONS
function changeBrackets(newType) {
	// Check input is valid
	if (!(newType in [0,1,2,3,4])) {
		return;
	}

	// Change styles
	var buttons = document.getElementById("buttons").getElementsByTagName("button");
	buttons[bracketType].classList.remove("selected");
	buttons[newType].classList.add("selected");

	bracketType = newType;

	if (lastCalledMath) {
		updateMath(document.getElementById("math-input").value);
	} /* else {
		var latexCode = document.getElementById("latex-output").value;
		latexCode = brackets[bracketType][0] + latexCode + brackets[bracketType][1];
		updateLATEX(latexCode);
	} */
}

function clearInputs() {
	document.getElementById("math-input").value = "";
	document.getElementById("latex-output").value = "";
}

function copyLATEX() {
	var latexOutput = document.getElementById("latex-output");
	latexOutput.select();
	latexOutput.setSelectionRange(0, 99999);
	navigator.clipboard.writeText(latexOutput.value);
}