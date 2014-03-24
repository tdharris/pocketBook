function multiselect(){
	this.list = document.getElementById("taglist");
	this.taglist = {
		"tags" : [ "tag1", "tag2", "tag3"]
	}
	localStorage.setItem("taglist", JSON.stringify(taglistjson)); 
	this.load();
	this.render();
	
}

multiselect.prototype ={
	load: function(){
		this.data = JSON.parse(localStorage.getItem('taglist'));
		console.log(this.data);
		if(this.data){
			this.render();
		}
		else{
			this.data = { tags: {} };
			this.list.innerHTML = '';
		}
			
	},

	// selectTag: function(){

	// },

	addTag: function(){
		var newTag = document.getElementById("newTag");

		// newtag.oninput = function(e){
		// 	var value = document.getElementById("newTag").value;

		// 	alert("hi");
		// 	// this.data.tags.push(value);
		// }




	},

	render: function(){
		this.list.innerHTML = '';

		taglist.tags.forEach(this.createlist(this.data));
		
	},

	createlist: function(tags){
		
		var taglistLI = document.createElement("li");
		console.log(taglistLI.innerHTML = tags);

		//list.appendChild(taglistLI); 

	}



}


