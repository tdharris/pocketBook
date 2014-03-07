function resizeImage(newReceipt, callback) {
	// from an input elements
	var filesToUpload = newReceipt.input.files;
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

	newReceipt.dataURL = canvas.toDataURL("image/png");
	delete newReceipt.input;
	callback(newReceipt);
}

function addReceipt(newReceipt) {
	// Grab input field/img from form & create newReceipt object
	// newReceipt.input .year .month .tags
	newReceipt.date = new Date();
	newReceipt.tags = ['best buy'];

	resizeImage(newReceipt, function(newReceipt) {
		// Fetch receipts from storage
		var library = JSON.parse(localStorage.getItem("pbReceipts"));

		// Add receipt to library
		// JSON object structure "library":
		// containers > months > receipts
		// containers: grouped by month/year
		// month: month, year, array of receipts
		// receipts: dataURL, array of tags

		try {
			// Does the current month/year exist in the store?
			for(var i = 0; i < library.containers.length; i++){
				// month/year container already exists for newReceipt
				if (library.containers[i].date.getMonth() == newReceipt.date.getMonth() && library.containers[i].date.getFullYear() == newReceipt.date.getFullYear()) {
					// append receipt to library.containers[i].receipts
					library.containers[i].receipts.push({
						"date": JSON.stringify(newReceipt.date),
						"dataURL": newReceipt.dataURL,
						"tags": newReceipt.tags;
					});
				} else {
					// month/year container must be created
					library.containers[i].push({
						"date": JSON.stringify(newReceipt.date),
						"receipts": [{
							"dataURL": newReceipt.dataURL,
							"tags": newReceipt.tags;
						}];
					})
				}
			}
		}

		finally {
			// Save to storage
			localStorage.setItem("pbReceipts", JSON.stringify(receipts));
		}
		 
	});

}