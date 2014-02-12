function init() {
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

function addReceipt(event) {

	event.preventDefault();

	// Handle incoming form for newReceipt
	// var img = document.getElementById();
	// var tags = document.getElementById();
	// var id = somelogictogetuniqueid...;

	// ??? get the values ???
	// img = document.getElementById("theimg");
	// tags = document.getElementById("thetags").value;
	// console.log('img: ' + img + ' tags: ' + tags);


	var fileInput = document.getElementById('theimg');
	var fileDisplayArea = document.getElementById('fileDisplayArea');

		var file = fileInput.files[0];
		var type = /image.*/;

		if (file.type.match(type)) {
			var reader = new FileReader();

			reader.onload = function(e) {
				fileDisplayArea.innerText = reader.result;
			}

			reader.readAsText(file);	
		} else {
			fileDisplayArea.innerText = "File not supported!"
		}

	// var ctx = canvas.getContext("2d");
	// ctx.drawImage(img, 0, 0);

	// var MAX_WIDTH = 800;
	// var MAX_HEIGHT = 600;
	// var width = img.width;
	// var height = img.height;

	// if (width > height) {
	//   if (width > MAX_WIDTH) {
	//     height *= MAX_WIDTH / width;
	//     width = MAX_WIDTH;
	//   }
	// } else {
	//   if (height > MAX_HEIGHT) {
	//     width *= MAX_HEIGHT / height;
	//     height = MAX_HEIGHT;
	//   }
	// }
	// canvas.width = width;
	// canvas.height = height;
	// var ctx = canvas.getContext("2d");
	// ctx.drawImage(img, 0, 0, width, height);

	// var dataurl = canvas.toDataURL("image/png");

	// // Create receipt JSON object & add to cached library
	// var newReceipt = {'imgURL': dataurl, 'tags': tags };
	// myReceipts.push(newReceipt);

	// // Add the entire store back into storage (saves new Receipt, persistent)
	// localStorage.setItem("pbReceipts", JSON.stringify(myReceipts));
	
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


// Listeners
// document.getElementById('submit').addEventListener(
//     'click', stopDefAction, false
// );

