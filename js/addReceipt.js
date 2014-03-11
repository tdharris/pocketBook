document.addEventListener('DOMContentLoaded',function(){
	var snap = document.getElementById("snap");
	var fileThingy = document.getElementById("file-thingy");
	var newReceipt = document.getElementById("newReceipt"); 
	snap.onclick=function(e){ 
		fileThingy.click(); 
	};
	fileThingy.onchange=function(e){ 
		var file=e.target.files[0];
		previewImage(file);
	};
	newReceipt.onclick=function(e){
		var	fileThingy = document.getElementById('file-thingy'),
			newReceipt = {};
		console.log(fileThingy.files[0]);
		render(fileThingy.files[0], function(dataUrl) {
			//clear out file input
			fileThingy.value = null;
			
			//do something with data url
			console.log('my data url: ', dataUrl);
			newReceipt.dataUrl = dataUrl;
			// newReceipt.tags = document.getElementById('').value;

			addReceipt(newReceipt, function() {
				console.log('finished adding receipt.');
			});
		});
	}
});

function previewImage(file) {
	document.getElementById("showMeImg").src = window.URL.createObjectURL(file); 
	document.getElementById('clickMe').style.display = 'none';
	document.getElementById('showMe').style.display = 'block';
};

function render(file, done) {
	var reader = new FileReader();

	reader.onload = function(e) {
		var dataUrl = e.target.result,
			img = document.createElement('img'),
			canvas = document.createElement('canvas'),
			MAX_WIDTH = 800,
			MAX_HEIGHT = 600;
		
		// wait for image to load before checking width/height etc.
		img.onload = function() {
			// resize to MAX_HEIGHT and maintain aspect ratio
			if (img.width > img.height) {
			  if (img.width > MAX_WIDTH) {
			    img.height *= MAX_WIDTH / img.width;
			    img.width = MAX_WIDTH;
			  }
			} else {
			  if (img.height > MAX_HEIGHT) {
			    img.width *= MAX_HEIGHT / img.height;
			    img.height = MAX_HEIGHT;
			  }
			}
			var ctx = canvas.getContext('2d');
			// reset canvas for rendering into
			ctx.clearRect(0,0, canvas.width, canvas.height);
			canvas.width = img.width;
			canvas.height = img.height;
			ctx.drawImage(img, 0, 0, img.width, img.height);
			
			// pass along data url in callback
			done(canvas.toDataURL());
			
		}
		img.src=e.target.result;
	};
	reader.readAsDataURL(file);
}

function addReceipt(newReceipt) {
	// Grab input field/img from form & create newReceipt object
		// newReceipt.input .year .month .tags
	newReceipt.date = new Date();
	newReceipt.tags = ['best buy'];

		// Add receipt to library
		// JSON object structure "library":
			// containers (month/year) > receipts
			// containers: grouped by month/year
			// receipts: dataUrl, array of tags

		try {
			// Fetch receipts from storage
			var library = JSON.parse(localStorage.getItem("pbReceipts"));

			// Does the current month/year exist in the store?
			for(var i = 0; i < library.containers.length; i++){
				// month/year container already exists for newReceipt
				var containerDate = new Date(JSON.parse(library.containers[i].date));
				if (containerDate.getMonth() == newReceipt.date.getMonth() && containerDate.getFullYear() == newReceipt.date.getFullYear()) {
					// append receipt to library.containers[i].receipts
					library.containers[i].receipts.push({
						"dataUrl": newReceipt.dataUrl,
						"tags": newReceipt.tags
					});
				} else {
					// month/year container must be created
					library.containers[i].push({
						"date": newReceipt.date,
						"receipts": [{
							"dataUrl": newReceipt.dataUrl,
							"tags": newReceipt.tags
						}]
					})
				}
			}
		}

		catch(e) {
			console.log(e);
		}

		finally {
			// Save library to storage
			localStorage.setItem("pbReceipts", JSON.stringify(library));
		}

}