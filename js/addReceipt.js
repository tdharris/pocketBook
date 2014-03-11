document.addEventListener('DOMContentLoaded',function(){
	var snap = document.getElementById("snap");
	var hiddensnap = document.getElementById("hiddensnap");
	var newReceipt = document.getElementById("newReceipt"); 
	snap.onclick=function(e){ 
		hiddensnap.click(); 
	};
	hiddensnap.onchange=function(e){ 
		var file=e.target.files[0];
		previewImage(file);
	};
	newReceipt.onclick=function(e){
		file = document.getElementById('hiddensnap').files[0];
		resizeImage(file, function(dataurl) {
			console.log('finished resizing: ' + dataurl);
		});
	}
});

function previewImage(file) {
	document.getElementById("showMeImg").src = window.URL.createObjectURL(file); 
	document.getElementById('clickMe').style.display = 'none';
	document.getElementById('showMe').style.display = 'block';
};

// function removeImage() {
// 	document.getElementById('hiddensnap').value = "";
// 	document.getElementById('showMe').style.display = 'none';
// 	document.getElementById('clickMe').style.display = 'block';
// };

function resizeImage(file, callback) {
	var img = document.createElement("img");
	var reader = new FileReader();  
	reader.onload = function(e) {img.src = e.target.result}
	reader.readAsDataURL(file);

	var canvas = document.createElement('canvas');
	document.body.appendChild(canvas);
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0);

	// var MAX_WIDTH = 800;
	// var MAX_HEIGHT = 600;
	var width = img.width;
	var height = img.height;

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
	var ctx = canvas.getContext("2d");
	ctx.drawImage(img, 0, 0, width, height);
	var dataurl = canvas.toDataURL("image/png");
	
	callback(dataurl);
}

function addReceipt(newReceipt) {
	// Grab input field/img from form & create newReceipt object
		// newReceipt.input .year .month .tags
	newReceipt.date = new Date();
	newReceipt.tags = ['best buy'];

	resizeImage(newReceipt, function(newReceipt) {
		// Add receipt to library
		// JSON object structure "library":
			// containers (month/year) > receipts
			// containers: grouped by month/year
			// receipts: dataURL, array of tags

		try {
			// Fetch receipts from storage
			var library = JSON.parse(localStorage.getItem("pbReceipts"));

			// Does the current month/year exist in the store?
			for(var i = 0; i < library.containers.length; i++){
				// month/year container already exists for newReceipt
				if (library.containers[i].date.getMonth() == newReceipt.date.getMonth() && library.containers[i].date.getFullYear() == newReceipt.date.getFullYear()) {
					// append receipt to library.containers[i].receipts
					library.containers[i].receipts.push({
						"dataURL": newReceipt.dataURL,
						"tags": newReceipt.tags
					});
				} else {
					// month/year container must be created
					library.containers[i].push({
						"date": JSON.stringify(newReceipt.date),
						"receipts": [{
							"dataURL": newReceipt.dataURL,
							"tags": newReceipt.tags
						}]
					})
				}
			}
		}

		finally {
			// Save library to storage
			localStorage.setItem("pbReceipts", JSON.stringify(library));
		}
		 
	});

}