function Library(name) {
	this.view = document.getElementById("library");
	this.name = name;
	this.load();
}
 
Library.prototype = {
 
	load: function(){
		this.data = JSON.parse(localStorage.getItem(this.name));
		if(this.data) this.render();
 
		// default if it doesn't exist
		if(!this.data) this.data = { containers: {} };
		
	},
 
	save: function() {
		console.log('saving library: ', this.name, this.data);

		try {
			console.log('JSON stringify is fine: ', JSON.stringify(this.data));
			localStorage[this.name] = JSON.stringify(this.data);
		}
		catch (e) {
			console.log(e);
		}
	},
 
	render: function() {
		var self = this;
 
		addClass("library", "loading-overlay");
 
		// reset/clear out view
		this.view.innerHTML = '';
				
		Object.keys(this.data.containers).forEach(function(key) {
			self.renderContainer(self.data.containers[key]);
		});
 
		removeClass("library", "loading-overlay");
	},
 
	renderContainer: function(container) {
		var self = this,
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
		container.receipts.forEach(function(receiptJSON) {
			var receipt = new Receipt(receiptJSON, ulReceipts);
			receipt.render(ulReceipts);
		});
 
		// Append to view
		liMonth.classList.add("fadeInDown");
		this.view.appendChild(liMonth);
	},
 
	getReceipts: function() {
		return this.data.containers;
	},
 
	setup: function() {
 
	},
 
	addReceipt: function(data) {
 		var self = this;
		this.getDataURL(data.file, function(dataUrl) {
			var receipt = new Receipt({
				"url": dataUrl,
				"tags": data.tags
			});
 
			delete dataUrl;
			
			// check for existing container by date
			var containerKey = receipt.data.containerKey; // 12-2013
 
			// TODO: Uncaught TypeError: Cannot read property 'containers' of undefined 
			// this here actually is referring to window/global, while this above (this.getDataURL) doesn't
			if(!self.data.containers[containerKey]) {
				self.data.containers[containerKey] = {
					"date": new Date(),
					"receipts": []
				};
			}
 
			self.data.containers[containerKey].receipts.push(receipt.data);
 
			// Save to localStorage
			console.log('from memory: ', self.data);
			self.save();
 			
 
			// Append to view
			self.render();
			console.log('from localStorage: ', JSON.parse(localStorage.getItem('pbReceipts')));
 
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