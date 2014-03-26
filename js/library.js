function Library(name) {
	this.view = document.getElementById("library");
	this.name = name;
	this.load();
}
 
Library.prototype = {
 
	load: function(){
		this.setup();
		this.data = JSON.parse(localStorage.getItem(this.name));
		if(this.data) this.render();
 
		// default if it doesn't exist
		if(!this.data) { 
			this.data = { containers: {} };
			this.view.innerHTML = '';
		}

		if(!this.data.tagList) this.data.tagList = [];
	},

	save: function() {
		localStorage[this.name] = JSON.stringify(this.data);
	},

	setup: function() {

		document.handleRequest = function(e) {
			var theClickedThing = e.currentTarget.attributes.id.nodeValue;
			self.appMap[theClickedThing](e);
		}

		this.appMap = [];
	 	var self = this,
			fileThingy = document.getElementById("file-thingy");

		this.addToAppHandler('openMe', function() {
			self.previewReset();
			self.blur(true);
			// var multi = new multiselect();
		});

		this.addToAppHandler('closeMe', function() {
			self.blur(false);
			fileThingy.value = null;
		});

		this.addToAppHandler('clearAll', function() {
			self.deleteLibrary();
		});

		this.addToAppHandler('dropzone', function() {
			fileThingy.click(); 
		});

		this.addToAppHandler('newReceipt', function() {
			var	fileThingy = document.getElementById('file-thingy'),
				tags = ['tag1', 'tag2'];

			self.addReceipt({
				"file": fileThingy.files[0],
				"tags": tags
			}, function() {
				document.getElementById('closeMe').click();
			});
		});

		this.addToAppHandler('file-thingy', function(e) {
			var file=e.target.files[0];
			self.previewImage(file);
		});

	},

	addToAppHandler: function(akey, newFunction) {
		this.appMap[akey] = newFunction;
	},
 
	render: function() {
		var self = this;
		addClass("library", "loading-overlay");
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
			receipt.render();
		});
 
		// Append to view
		liMonth.classList.add("fadeInDown");
		this.view.appendChild(liMonth);
	},
 
	addReceipt: function(data, done) {
		var self = this;
		this.getDataURL(data.file, function(dataUrl) {
			var receipt = new Receipt({
				"url": dataUrl,
				"tags": data.tags
			});
 			
			delete dataUrl;
			
			// check for existing container by date
			var containerKey = receipt.data.containerKey; // 12-2013
 
			if(!self.data.containers[containerKey]) {
				self.data.containers[containerKey] = {
					"date": new Date(),
					"receipts": []
				};
			}
 			
			self.data.containers[containerKey].receipts.push(receipt.data);
 
			// Save to localStorage & append to view
			self.save();
			self.render();
 			
 			done();
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

	deleteLibrary: function() {
		localStorage.setItem(this.name, null);
		this.load();
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

	previewImage: function(file) {
		document.getElementById('showMeImg').src = window.URL.createObjectURL(file); 
		document.getElementById('clickMe').style.display = 'none';
		document.getElementById('showMe').style.display = 'block';
	},

	previewReset: function() {
		document.getElementById('showMeImg').src = ''; 
		document.getElementById('clickMe').style.display = 'block';
		document.getElementById('showMe').style.display = 'none';
	},

	blur: function(boolean) {
		var header = document.getElementsByTagName('header')[0],
			footer = document.getElementsByTagName('footer')[0];
		if (boolean) {
			header.classList.add('blur');
			this.view.classList.add('blur');
			footer.classList.add('blur');
		}
		else {
			header.classList.remove('blur');
			this.view.classList.remove('blur')
			footer.classList.remove('blur');
		}
	},
	multiselect: function(){
		var listoftags=  ["walmart", "best", "hi"],
			taglistUL = document.getElementById('taglistUL'),
			self = this;

		function setupTagList(self) {
			return function(tag) {
				var taglistLI = document.createElement("li");
				taglistLI.innerHTML = tag;
				// taglistLI.setAttribute('id', tagdata);
				taglistLI.onclick = function (){
					self.data.tagList.push(tag);
					console.log(self.data.tagList);
				}
				taglistUL.appendChild(taglistLI);
			}
		}

		listoftags.forEach(setupTagList(self));
			
	}
 
};