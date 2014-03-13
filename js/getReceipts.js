/* This function gets the receipts and populates the view */ 
function getReceipts(){
	
	addClass("library", "loading-overlay");

	/* Get the JSON Object from Local Stoarage */
	// var theLibrary = localStorage.getItem("pbReceipts");
	var theLibrary = localStorage.getItem("pbReceipts");

		// Skip if library is just an empty object
		if (isThereSomethingHere(theLibrary)) {
			theLibrary = JSON.parse(theLibrary);
			/* Get the Reciept Library */
			var view = document.getElementById("library");
			view.innerHTML = '';

			/* This loop creates the month and Receipts containers */
			for(var i = 0; i < theLibrary.containers.length; i++){
				var containerDate = new Date(theLibrary.containers[i].date);

				/* Create the Month Container */
				var monthli = document.createElement("li");

				/* Create the Container Month Name */
				var monthH2 = document.createElement("h2");

				/* Create the Receipt Container */ 
				var receiptsUL= document.createElement("ul");
				receiptsUL.setAttribute('id', 'receipts')
				var monthText = containerDate.getMonthName() + " " + containerDate.getFullYear();

				/* Append the elements */ 
				monthH2.innerText = monthText; 
				monthli.appendChild(monthH2);
				monthli.appendChild(receiptsUL);
				view.appendChild(monthli);

			 	/* This loops Creates the Receipts Objects */
				theLibrary.containers[i].receipts.forEach(function(theReceipt) {

					// Create elements
					var receiptLI = document.createElement("li"),
						image = document.createElement("img"),
						url = theReceipt.dataUrl,
						tags = document.createElement("ul");

					// Create onclick listener
					receiptLI.addEventListener('click', function() {
						// Remove from localStorage
						
						
						// Remove from DOM
						
					});

					receiptLI.setAttribute('id', theReceipt.uid);
					
					image.style.height = "180px";
					image.style.width = "90px"
					image.src = url;

					/* Append the iamge to the Reciept Object */ 
					receiptsUL.appendChild(receiptLI);
					receiptLI.appendChild(image);
					receiptLI.appendChild(tags);

					tags.className = "tag-overlay";

					/* This loop creates the tags objects */
					theReceipt.tags.forEach(createTag(tags));

				});
			}

		}	
		
removeClass("library", "loading-overlay");

}

function createTag(tags) {
	return function(tagText) {
		/* Create the Tag */ 
		var tagLI = document.createElement("li");
		tagLI.innerHTML = tagText;
		
		/* Append the Tag to the Containter */ 
		tags.appendChild(tagLI);
	}
}

self.addEventListener('message', function(e) {
  getReceipts();
}, false);