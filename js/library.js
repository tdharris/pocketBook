function Library(name) {
	this.name = name;
	this.load();
}

Library.prototype = {

	load: function(){
		this.data = JSON.parse(localStorage.getItem(this.name));

		// default if it doesn't exist
		if(!this.data) this.data = { containers: [] };
		if(this.data) this.render().bind(this);
	},

	save: function() {
		localStorage.setItem(this.name, JSON.stringify(this.data));
	},

	render: function() {
		addClass("library", "loading-overlay");

		this.containers.forEach(function(container) {
			var view = document.getElementById("library"),
				date = new Date(container.date),
				liMonth = document.createElement("li"),
				h2Month = document.createElement("h2"),
				ulReceipts = document.createElement("ul"),
				monthText = date.getMonthName() + " " + date.getFullYear();

			// Reset current view
			view.innerHTML = '';

			// Append elements to container
			h2Month.innerText = monthText;
			liMonth.appendChild(h2Month);
			liMonth.appendChild(ulReceipts);

			// Append receipts to ulReceipts
			container.receipts.forEach(this.renderReceipts(ulReceipts).bind(this));

			// Append to view
			removeClass("library", "loading-overlay");
			view.appendChild(liMonth);

		});

	},

	renderReceipts: function(ulReceipts) {
		return function(receipt) {
			ulReceipts.appendChild(receipt.render());
		}
	},

	setup: function() {

	},

	addReceipt: function(receipt) {
		var	fileThingy = document.getElementById('file-thingy');

		this.getDataURL(fileThingy.files[0], function(dataUrl) {
			var newReceipt = new Receipt({ "url": dataUrl });

			// check for existing container by date
			var containerKey = receipt.containerKey; // 12-2013

			if(!this.data.containers[containerKey]) {
				this.data.containers[containerKey] = [];
			}

			this.data.containers[containerKey].push({
				containerKey: containerKey,
				uuid: receipt.uuid,
				dataUrl: receipt.dataUrl,
				tags: receipt.tags
			});

			this.save();

			// Append to view
			getReceipts();

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