function resizeImage(input, callback) {
	// from an input element
	var filesToUpload = input.files;
	var file = filesToUpload[0];

	var img = document.createElement("img");
	var reader = new FileReader();  
	reader.onload = function(e) {img.src = e.target.result}
	reader.readAsDataURL(file);

	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);

	var MAX_WIDTH = 800;
	var MAX_HEIGHT = 600;
	var width = img.width;
	var height = img.height;

	if (width > height) {
	  if (width > MAX_WIDTH) {
	    height *= MAX_WIDTH / width;
	    width = MAX_WIDTH;
	  }
	} else {
	  if (height > MAX_HEIGHT) {
	    width *= MAX_HEIGHT / height;
	    height = MAX_HEIGHT;
	  }
	}
	canvas.width = width;
	canvas.height = height;
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, width, height);

	var dataurl = canvas.toDataURL("image/png");
	callback(dataurl);
}

function addReceipt() {
	// Grab input field/img from form


	resizeImage(input, function(dataurl) {
		// Fetch receipts from storage
		var receipts = JSON.parse(localStorage.getItem("pbReceipts"));

		// Add receipt to receipts
			// JSON object structure:
			// containers: grouped by month/year
			// month: month, year, array of receipts
			// receipts: imgURL, array of tags

		// Does the current month/year exist in the store?
		

		// Save to storage
		localStorage.setItem("pbReceipts", JSON.stringify(receipts)); 
	});

}