function Library(name) {
	this.name = name;
	this.load();
}

Library.prototype = {

	load: function(){
		this.data = JSON.parse(localStorage.getItem(this.name));
		if(this.data) this.render();

		// default if it doesn't exist
		if(!this.data) this.data = { containers: [] };
		
	},

	save: function() {
		localStorage.setItem(this.name, JSON.stringify(this.data));
	},

	render: function() {
		addClass("library", "loading-overlay");

		var view = document.getElementById("library");
		view.innerHTML = '';
				
		this.data.containers.forEach(renderContainers(view).bind(this));

		removeClass("library", "loading-overlay");
	},

	getReceipts: function() {
		return this.data.containers;
	},

	// renderReceipts: function(ulReceipts) {
	// 	return function(receiptJSON) {
	// 		console.log(receiptJSON);
	// 		var receipt = new Receipt(receiptJSON);
	// 		ulReceipts.appendChild(receipt.render());
	// 	}
	// },

	setup: function() {

	},

	addReceipt: function(file, tags) {

		this.getDataURL(file, function(dataUrl) {
			var receipt = new Receipt({
				"url": dataUrl,
				"tags": tags
			});

			delete dataUrl;
			
			// check for existing container by date
			var containerKey = receipt.data.containerKey; // 12-2013

			// TODO: Uncaught TypeError: Cannot read property 'containers' of undefined 
			// this here actually is referring to window/global, while this above (this.getDataURL) doesn't
			if(!this.data.containers[containerKey]) {
				this.data.containers[containerKey] = [];
			}

			this.data.containers[containerKey].push(receipt.toString());

			// Save to localStorage
			this.save();

			// Append to view
			this.render();

		});
		
	},

	removeReceipt: function(receipt) {
		var receiptIdx,
			containerKey = receipt.containerKey,
			container = this.data.containers[containerKey];

		if(!container) throw new Error("receipt doesn't exist");

		container.forEach(function(savedReceipt, idx) {
			if(savedReceipt.uuid === receipt.uuid) receiptIdx = idx;
		});

		this.data.containers[containerKey] = container.slice(receiptIdx);

		this.save();
	},

	toJSON: function() {
		return {
			name: this.data.name,
			container: this.data.containers
		}
	},

	getDataURL: function(file, done) {
		var reader = new FileReader();

		reader.onload = function(e) {
			var dataUrl = e.target.result,
				img = document.createElement('img'),
				canvas = document.createElement('canvas'),
				MAX_WIDTH = 250,
				MAX_HEIGHT = 450;
			
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
	},

};

function renderContainers(view) {
	return function(container) {
		date = new Date(container.date),
		liMonth = document.createElement("li"),
		h2Month = document.createElement("h2"),
		ulReceipts = document.createElement("ul"),
		monthText = date.getMonthName() + " " + date.getFullYear();

		// Append elements to container
		h2Month.innerText = monthText;
		liMonth.appendChild(h2Month);
		liMonth.appendChild(ulReceipts);

		// Append receipts to ulReceipts
		container.receipts.forEach(renderReceipts(ulReceipts).bind(this));

		// Append to view
		liMonth.classList.add("fadeInDown");
		view.appendChild(liMonth);
	}

}

function renderReceipts(ulReceipts) {
	return function(receiptJSON) {
		var receipt = new Receipt(receiptJSON);
		ulReceipts.appendChild(receipt.render());
	}
}