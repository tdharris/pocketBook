function Receipt(data, parentElement) {
	this.data = data;
	this.data.date = new Date();
	this.data.containerKey = this.date.getMonth() + "-" + this.date.getFullYear();
	this.parentElement = parentElement;
	this.liElement = null;
}

Receipt.prototype = {

	render: function() {
		this.liElement = document.createElement('li');
		this.parentElement.appendChild(this.liElement);
	},

	setup: function() {
		this.liElement.addEventListener('click', this.remove.bind(this));
	},

	remove: function() {
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