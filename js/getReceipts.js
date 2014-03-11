/* This function gets the receipts and populates the view */ 
function getReceipts(){
	
	/* Get the JSON Object from Local Stoarage */
	var library = JSON.parse(localStorage.getItem("pbReceipts"));

	if (typeof variable_here === 'undefined') {

	};

	/* Get the Reciept Library */
	var view = document.getElementById("library");

	/* This loop creates the month and Receipts containers */
	for(var i = 0; i < library.containers.length; i++){
		var containerDate = new Date(JSON.parse(library.containers[i].date));

		/* Create the Month Container */
		var monthli = document.createElement("li");

		/* Create the Container Month Name */
		var monthH2 = document.createElement("h2");

		/* Create the Receipt Container */ 
		var receiptsUL= document.createElement("ul");
		var monthText = containerDate.getMonthName() + " " + containerDate.getFullYear();


		/* Append the elements */ 
		monthH2.innerText = monthText; 
		monthli.appendChild(monthH2);
		
		monthli.appendChild(receiptsUL);

		view.appendChild(monthli);


	 	/* This loops Creates the Receipts Objects */
		for(var j = 0; j < library.containers[i].receipts.length; j++){

			/* Create the Receipt Object */ 
			var receiptLI = document.createElement("li");

			/* Create the Image for the Receipt */ 
			var image = document.createElement("img");
			image.style.height = "180px";
			image.style.width = "90px"

			var url = library.containers[i].receipts[j].dataUrl;
			image.src = url;

			/* Create the Tags Container */ 
			var tags = document.createElement("ul");

			/* Append the iamge to the Reciept Object */ 
			receiptsUL.appendChild(receiptLI);
			receiptLI.appendChild(image);
			receiptLI.appendChild(tags);

			tags.className = "tag-overlay";

			/* This loop creates the tags objects */
			for(var k = 0; k < library.containers[i].receipts[j].tags.length; k++){

				/* Create the Tag */ 
				var tagLI = document.createElement("li");

				var tagText = library.containers[i].receipts[j].tags[k];

				tagLI.innerHTML = tagText;

				/* Append the Tag to the Containter */ 
				tags.appendChild(tagLI);

			}
		}
	}
}

self.addEventListener('message', function(e) {
  getReceipts();
}, false);