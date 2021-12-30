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
function update(mathInput) {
	// Convert to LATEX and output code
	var latexCode = AMTparseAMtoTeX(mathInput);
	document.getElementById("latex-output").value = latexCode;

	// Render the LATEX as an equation and display it
	var element = prepareEquation("\\(" + latexCode + "\\)");
	document.getElementById("math-container").innerHTML = "";
	document.getElementById("math-container").appendChild(element);
}