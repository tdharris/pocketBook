function Receipt(data, parentElement) {
	this.data = data;
	this.init();
	this.parentElement = parentElement;
}

Receipt.prototype = {

	init: function() {
		this.data.date = new Date();
		this.data.containerKey = this.data.date.getMonth() + "-" + this.data.date.getFullYear();
		this.data.uuid = this.data.date.valueOf();
	},

	render: function() {
		this.liReceipt = document.createElement("li");
		var image = document.createElement("img"),
			url = this.data.url,
			tags = document.createElement("ul");
		
		// Set attributes
		image.style.maxHeight = "180px";
		image.style.maxWidth = "90px"
		image.src = url;
		tags.className = "tag-overlay";

		// Render tags
		this.data.tags.forEach(this.createTag(tags));

		// Append elements to ul
		this.liReceipt.appendChild(image);
		this.liReceipt.appendChild(tags);

		// Add eventListeners
		this.setup();

		this.parentElement.appendChild(this.liReceipt);
		// return liReceipt;
	},

	setup: function() {
		var self = this;
		Hammer(this.liReceipt).on("hold", function(event) { 
			if(self.liReceipt.classList.contains('freakOut')){
				self.liReceipt.classList.remove('freakOut');
			} else {
				self.liReceipt.classList.add('freakOut');
			}
		});
	},

	remove: function() {
		// Remove from localStorage & DOM
		console.log('removing');
		this.parentElement.removeChild(this.liReceipt);
		this.liReceipt = null;
	},

	createTag: function(tags) {
		return function(tagText) {
			/* Create the Tag */ 
			var tagLI = document.createElement("li");
			tagLI.innerHTML = tagText;
			
			/* Append the Tag to the Containter */ 
			tags.appendChild(tagLI);
		}
	},

	toJSON: function() {
		return {
			containerKey: this.containerKey,
			uuid: this.data.uuid,
			url: this.data.url,
			tags: this.data.tags
		};
	}

};