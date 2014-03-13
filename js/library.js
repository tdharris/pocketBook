function Library(name) {
	this.name = name;
	this.load();
}

Library.prototype = {

	load: function(){
		this.data = JSON.parse(localStorage.getItem(this.name));

		// default if it doesn't exist
		if(!this.data) this.data = { containers: [] };
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
			// TODO: How to provide ulReceipts to forEach below?
			container.receipts.forEach(function(receipt) {
				var liReceipt = document.createElement("li"),
					image = document.createElement("img"),
					url = receipt.dataUrl,
					tags = document.createElement("ul");

				liReceipt.addEventListener('click', function() {
					// Remove from localStorage & DOM
					// library.removeReceipt(receipt);
					
				});
				
				// Set attributes
				image.style.height = "180px";
				image.style.width = "90px"
				image.src = url;
				tags.className = "tag-overlay";

				// Append elements to ul
				liReceipt.appendChild(image);
				liReceipt.appendChild(tags);
				ulReceipts.appendChild(liReceipt);
				
				// Render tags
				receipt.tags.forEach(createTag(tags));
			});

			// Append to view
			removeClass("library", "loading-overlay");
			view.appendChild(liMonth);

		});

	},

	setup: function() {

	},

	addReceipt: function(receipt) {
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