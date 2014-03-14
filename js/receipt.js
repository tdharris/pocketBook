function Receipt(data, parentElement) {
	this.init();
	this.data = data;
	this.parentElement = parentElement;
	this.liElement = null;
}

function Receipt(data) {
	this.init();
	this.data = data;
}

Receipt.prototype = {

	init: function() {
		this.data.date = new Date();
		this.data.containerKey = this.data.date.getMonth() + "-" + this.data.date.getFullYear();
	},

	render: function() {
		var liReceipt = document.createElement("li"),
			image = document.createElement("img"),
			url = receipt.dataUrl,
			tags = document.createElement("ul");
		
		// Set attributes
		image.style.height = "180px";
		image.style.width = "90px"
		image.src = url;
		tags.className = "tag-overlay";

		// Render tags
		receipt.tags.forEach(createTag(tags));

		// Append elements to ul
		liReceipt.appendChild(image);
		liReceipt.appendChild(tags);

		// Add eventListeners
		this.setup.bind(this);

		this.parentElement.appendChild(liReceipt);
		// return liReceipt;
	},

	setup: function() {
		this.liElement.addEventListener('click', this.remove.bind(this));
	},

	remove: function() {
		// Remove from localStorage & DOM
		this.parentElement.removeChild(this.liElement);
		this.liElement = null;
	},

	toJSON: function() {
		return {
			uuid: this.data.uuid,
			dataUrl : this.data.url,
			containerKey: this.containerKey
		};
	}

};

function createTag(tags) {
	return function(tagText) {
		/* Create the Tag */ 
		var tagLI = document.createElement("li");
		tagLI.innerHTML = tagText;
		
		/* Append the Tag to the Containter */ 
		tags.appendChild(tagLI);
	}
};