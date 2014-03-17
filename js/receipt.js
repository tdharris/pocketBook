function Receipt(data, parentElement) {
	this.data = data;
	this.init();
	this.parentElement = parentElement;
	this.liElement = null;
}

Receipt.prototype = {

	init: function() {
		this.data.date = new Date();
		this.data.containerKey = this.data.date.getMonth() + "-" + this.data.date.getFullYear();
		this.data.uuid = this.data.date.valueOf();
	},

	render: function() {
		var liReceipt = document.createElement("li"),
			image = document.createElement("img"),
			url = this.data.url,
			tags = document.createElement("ul");
		
		// Set attributes
		// TODO: dynamically set height/width
		image.style.height = "180px";
		image.style.width = "90px"
		image.src = url;
		tags.className = "tag-overlay";

		// Render tags
		this.data.tags.forEach(this.createTag(tags));

		// Append elements to ul
		liReceipt.appendChild(image);
		liReceipt.appendChild(tags);

		// Add eventListeners
		this.setup.bind(this);

		// this.parentElement.appendChild(liReceipt);
		return liReceipt;
	},

	setup: function() {
		this.liElement.addEventListener('click', this.remove.bind(this));
	},

	remove: function() {
		// Remove from localStorage & DOM
		this.parentElement.removeChild(this.liElement);
		this.liElement = null;
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