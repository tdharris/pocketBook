function init {
	libraryContainer = document.getElementById("libraryContainer")
	var myReceipts = JSON.parse(localStorage.getItem("pbReceipts"));

	// Creat local storage if it does not already exist
	if (localStorage && !myReceipts) {
		var myReceipts = [];
		localStorage.setItem("pbReceipts", JSON.stringify(myReceipts));
	} else {
		// Populate the view (libraryContainer) with receipts from the store

	}

}

function addReceipt(receipt) {
	// Handle incoming form for newReceipt
	var img = document.getElementById();
	var tags = document.getElementById();
	var id = somelogictogetuniqueid...;
	
	var receipt = {'name': 'receipt3'};

	// Serialize image
	

	// Can I access myReceipts from initialize or do I need to pass it in?
	myReceipts.push(receipt);

	// Add the store back into storage
	localStorage.setItem("pbReceipts", JSON.stringify(myReceipts));

	// Add to view as well
	
}

function removeReceipt(receipt) {
	// simulate a newReceipt JSON object
	var receipt = {'name': 'receipt3'};

	var myReceipts = JSON.parse(localStorage.getItem("pbReceipts"));

	// Remove from view as well

}

function findReceipt(receipt) {

}

// <!-- Add to store -->
// var storageFiles = [{'name':'receipt1'},{'name':'receipt2'}];

// localStorage.setItem("storageFiles", JSON.stringify(storageFiles));

// <!-- Get store -->

// var storageFiles = JSON.parse(localStorage.getItem("storageFiles"))

// console.log(storageFiles);

// console.log(JSON.parse(localStorage.getItem("storageFiles")));


// <!-- NOTES -->
// setItem --> array of JSON objects representing our receipts... Create imgCanvas...?
// getItem

// appendItem --> getItem, appendItem in js, setItem again (overwrite) ---- seems inefficient...