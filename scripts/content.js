/**************************

		LISTENERS

***************************/

//Listener required to receive messages from background.js
chrome.runtime.onMessage.addListener( function( request, sender, sendResponse )
	{
		//the background will pass along the library of images via this request
		if ( request.action == "showLibrary" )
		{
			showLibrary( request.library );

			//donate will be true after every 20 'insert' actions.
			if ( request.donate === true )
			{
				//display the donate button
				$( "#gifsterDonateButton" ).css( "display", "inline-block" );
			}
		}
		//the background will add new bookmarks to the library via this request
		else if ( request.action == "addBookmark" )
		{
			//Only add a new bookmark if the library has already been initialized.
			if ( $( "#gifsterContainer" ).exists() )
			{
				addBookmark( request.newImage );
			}
		}
	});


/**************************

	  JQUERY FUNCTIONS

***************************/

//jQuery function to test if a selector returns nothing
$.fn.exists = function () {
    return this.length !== 0;
}


/**************************

	  GLOBAL VARIABLES

***************************/

//activeField is a global variable for keeping track of which textfield to insert the url into.
//This is required because the "active" element changes when you select an image to insert
//by clicking on it. Maybe there is a nicer way to do this ...
var activeField;


/**************************

		UI VISIBILITY

***************************/

/*
* showLibrary makes a UI window show up with a list of the user's images.
*/
function showLibrary( library )
{
	//Check if the UI window has been inserted into the source HTML already
	if ( !$( "#gifsterContainer" ).exists() )
	{
		//The UI has not been inserted into the source HTML. Insert it now.
		createLibrary( library );
		//Insert the user's gif library to the UI window.
		populateLibrary( library );
	}
	//The UI has been created already. Check if it is currently being displayed.
	else if( $( "#gifsterContainer" ).css( "display" ) != "block" )
	{
		//Display the UI div
		$( "#gifsterContainer" ).css( "display", "block" );
	}
}

/*
* hideLibrary hides the gifster UI window
*/
function hideLibrary()
{
	//Check if the UI is currently being displayed.
	if( $( "#gifsterContainer" ).css( "display" ) != "none" )
	{
		//Hide the UI		
		$( "#gifsterContainer" ).css( "display", "none" );
		//Set the scroll position to the top to prepare for the next time the UI is displayed.
		$( "#gifsterList" ).scrollTop( 0 );
		//Hide the donation button to prepare for the next time the UI is displayed.
		$( "#gifsterDonateButton" ).css( "display", "none" );
	}
}


/**************************

	  UI CREATION

***************************/

/*
* createLibrary inserts the UI into the source HTML.
*/
function createLibrary()
{
	//Prepare the source DOM for the UI
	$( "html" ).css( "height", "100%" );
	$( "html" ).css( "width", "100%" );
	$( "body" ).css( "height", "100%" );
	$( "body" ).css( "width", "100%" );

	//This is the css that is needed for the UI
	var style = document.createElement( "style" );
	style.type = "text/css";
	style.innerHTML = 
	'#gifsterContainer{' +
	'position: fixed;' +
	'top: 0px;' +
	'right: 0px;' +
	'left: 0px;' +
	'margin-right: auto;' +
	'margin-left: auto;' +
	'height: 100%;' +
	'width: 100%;' +
	'display: block;' +
	'z-index: 9999;' +
	'background-color: rgba( 97, 97, 97, 0.3 );' +
	'}' +
	'#gifsterDiv{' +
	'position: fixed;' +
	'top: 0px;' +
	'bottom: 0px;' +
	'right: 0px;' +
	'left: 0px;' +
	'margin-right: auto;' +
	'margin-left: auto;' +
	'margin-top: auto;' +
	'margin-bottom: auto;' +
	'height: 480px;' +
	'width: 500px;' +
	'display: block;' +
	'background-color: rgb( 255, 255, 255 );' +
	'}' +
	'#gifsterLogo{' +
	'display: inline-block;' +
	'width: 50px;' +
	'height: 50px;' +
	'}' +
	'#gifsterLogoAnchor{' +
	'display: inline-block;' +
	'padding: 10px;' +
	'width: 50px;' +
	'height: 50px;' +
	'cursor: pointer;' +
	'}' +
	'#gifsterCloseButton{' +
	'width: 20px;' +
	'height: 20px;' +
	'position: absolute;' +
	'top: 10px;' +
	'right: 10px;' +
	'cursor: pointer;' +
	'}' +
	'.gifsterActionButton{' +
	'width: 60px;' +
	'height: 60px;' +
	'padding: 10px;' +
	'cursor: pointer;' +
	'}' +
	'#gifsterList{' +
	'display: block;' +
	'width: 480px;' + 
	'height: 400px;' +
	'position: absolute;' +
	'right: 0px;' +
	'left: 0px;' +
	'top: 0px;' +
	'bottom: 0px;' +
	'margin-right: auto;' +
	'margin-left: auto;' +
	'margin-top: 70px;' +
	'margin-bottom: auto;' +
	'overflow-y: auto;' +
	'background-color: rgb( 235, 235, 235 );' +
	'}' +
	'#gifsterListSpacer{' +
	'display: inline-block;' +
	'width: 10px;' + 
	'height: 401px;' +
	'position: absolute;' +
	'right: 0px;' +
	'left: 0px;' +
	'top: 0px;' +
	'bottom: 0px;' +
	'margin-right: auto;' +
	'margin-left: auto;' +
	'margin-top: auto;' +
	'margin-bottom: auto;' +
	'overflow-y: auto;' +
	'background-color: rgb( 235, 235, 235 );' +
	'}' +
	'.gifsterListItem{' +
	'display: inline-block;' +
	'font: 15px;' +
	'color: black;' +
	'width: 220px;' +
	'height: 220px;' +
	'position: relative;' +
	'padding: 10px;' +
	'}' +
	'.gifsterActionDiv{' +
	'width: 160px;' +
	'height: 80px;' +
	'display: none;' +
	'position: absolute;' +
	'top: 0px;' +
	'bottom: 0px;' +
	'right: 0px;' +
	'left: 0px;' +
	'margin-right: auto;' +
	'margin-left: auto;' +
	'margin-top: auto;' +
	'margin-bottom: auto;' +
	'-webkit-border-radius: 10px;'+
	'-moz-border-radius: 10px;' +
	'border-radius: 10px;' +
	'background-color: rgba( 255, 255, 255, 0.5 );'+
	'}' +
	'#gifsterDonateForm{' +
	'display: inline-block;' +
	'}' +
	'#gifsterDonateButton{' +
	'display: none;' +
	'position: absolute;' +
	'top: 0px;' +
	'bottom: 0px;' +
	'right: 0px;' +
	'left: 0px;' +
	'margin-right: auto;' +
	'margin-left: auto;' +
	'margin-top: 10px;' +
	'margin-bottom: auto;' +
	'width: 50px;' +
	'height: 50px;' +
	'}';

	//Add the css to the source page head element
	document.head.appendChild( style );

	//Create the UI dom elements
	var container = document.createElement( "gifsterContainer" );
	var div = document.createElement( "gifsterDiv" );
	var anchor = document.createElement( "a" );
	var logo = document.createElement( "img" );
	var list = document.createElement( "gifsterList" );
	var listSpacer = document.createElement( "gifsterDiv" );
	var closeButton = document.createElement( "img" );
	//Create the donation elements
	var donateForm = document.createElement( "form" );
	var commandInput = document.createElement( "input" );
	var idInput = document.createElement( "input" );
	var submitInput = document.createElement( "input" );

	//Append all elements
	document.body.appendChild( container );
	container.appendChild( div );
	div.appendChild( list );
	div.appendChild( anchor );
	div.appendChild( donateForm );
	div.appendChild( closeButton );
	anchor.appendChild( logo );
	list.appendChild( listSpacer );
	donateForm.appendChild( commandInput );
	donateForm.appendChild( idInput );
	donateForm.appendChild( submitInput );

	//Set attributes for the donation form
	donateForm.action = "https://www.paypal.com/cgi-bin/webscr";
	donateForm.method = "post";
	donateForm.target = "_blank";
	donateForm.id = "gifsterDonateForm";

	//Set attributes for the donation inputs
	commandInput.type = "hidden";
	commandInput.name = "cmd";
	commandInput.value = "_s-xclick";
	idInput.type = "hidden";
	idInput.name = "hosted_button_id";
	idInput.value = "LAVD93TYYBBR2";
	submitInput.id = "gifsterDonateButton";
	submitInput.type = "image";
	submitInput.src = chrome.extension.getURL("images/donate.png");
	submitInput.name = "image";
	submitInput.alt = "Donate button";

	//Set attributes for UI elements
	container.id = "gifsterContainer";

	div.id = "gifsterDiv";

	anchor.id = "gifsterLogoAnchor";
	anchor.href = "https://github.com/DerekJones91/gifster";
	anchor.target = "_blank";

	logo.id = "gifsterLogo";
	logo.src = chrome.extension.getURL("images/logo_200.png");

	list.id = "gifsterList";

	listSpacer.id = "gifsterListSpacer";

	closeButton.className = "gifsterButton";
	closeButton.id = "gifsterCloseButton";
	closeButton.src = chrome.extension.getURL("images/close_button.png");
	closeButton.onclick = function()
	{ 
		//Clicking the close button will hide the UI
		hideLibrary(); 
	};
}


/**************************

		IMAGE LIBRARY

***************************/

/*
* populateLibrary adds the image library into the UI
*/
function populateLibrary( library )
{
	//Set the global variable 'activeField' to the input field that is currently selected in the source page.
	activeField = document.activeElement;
	
	//'library' contains all of the links to the user's images.
	for (var i = 0; i < library.length; i++)
	{
		//add an image to the UI
		addBookmark( library[ i ] );
	}
}

/*
* addBookmark adds an image into the UI
*/
function addBookmark( newImage )
{
	var list = document.getElementById( "gifsterList" );
	var listItem = 	document.createElement( "gifsterListItem" );
	var image = document.createElement( "img" );
	var actionMenu = document.createElement( "gifsterDiv" );
	var insertButton = document.createElement( "img" );
	var trashButton = document.createElement( "img" );

	//insert the thumbnail to the front of the list.
	list.insertBefore( listItem, list.firstChild );

	listItem.className = "gifsterListItem";
	listItem.appendChild( image );
	listItem.appendChild( actionMenu );
	//the "first" child is the image, the "last" is the action menu. We want the action menu to appear on hover.
	$( listItem ).hover(
	    		function()
	    		{
	    			$(this).children(":last").css( "display", "block" );
	    		},
	    		function()
	    		{
	    			$(this).children(":last").css( "display", "none" );
	    		});

	image.className = "lazy";
	image.setAttribute( "data-src", newImage );
	image.src = chrome.extension.getURL( "images/loading.gif" );
	image.setAttribute( "alt", "Gifster image" );
	image.width = 220;
	image.height = 220;
	//This attr will be used in the event of an error so that the
	//image can be removed from the library
	image.setAttribute( "gifsterImageURL", newImage );

	actionMenu.className = "gifsterActionDiv";
	actionMenu.appendChild( insertButton );
	actionMenu.appendChild( trashButton );
	//This attr will be used in the onclick function so that gifsterImageURL 
	//can be inserted into the active field in the source page
	actionMenu.setAttribute( "gifsterImageURL", newImage );

	//A button to insert the url into the active field
	insertButton.className = "gifsterActionButton";
	insertButton.src = chrome.extension.getURL( "images/insert.png" );

	//A button to remove the image from the library
	trashButton.className = "gifsterActionButton";
	trashButton.src = chrome.extension.getURL( "images/trash.png" );

	//initiate lazy loading
	$( image ).lazy({
		bind: "event",
		enableThrottle: true,
	    throttle: 250,
	    effect: "fadeIn",
	    effectTime: 1000,
	    afterLoad: function( element )
	    {
	    	//Some of these are un-needed but doing it this way makes what I am doing more clear.
	    	var image = $(element)[0];
	    	var listItem = image.parentNode;
	    	var actionDiv = listItem.lastChild;
	    	var insertButton = actionDiv.firstChild;
	    	var trashButton = actionDiv.lastChild;
	    	
			//load any new image that appears at the top by triggering scroll.
			$( "#gifsterList" ).scroll();

	        $(insertButton).on( "click", function()
    		{
				//We want to close the window after an image has been chosen.
				hideLibrary();
				//Get the original source image
				//We also want the image url to be inserted.
				insertImageURL( this.parentNode.getAttribute( "gifsterImageURL" ) );
    		});

    		$(trashButton).on( "click", function()
    		{
    			//Confirm that the user wants to remove the image from their library.
    			var confirmText = "Remove this image from your library?";
    			if ( confirm(confirmText) )
    			{
    				//remove the image
    				removeBookmark( this.parentNode.getAttribute( "gifsterImageURL" ) );
    			}
    		});
	    },
	    onError: function( element )
	    {
	    	//If there is an error loading the image we assume the link is broken.
	    	//Remove the bookmark from the UI and background.
	    	removeBookmark( element.attr( "gifsterImageURL" ) );
	    }
	});
}

/*
* removeBookmark removes images with broken links from the UI and background
*/
function removeBookmark( url )
{
	var list = document.getElementById( "gifsterList" );
	var image = $( "img[ gifsterImageURL = '" + url + "' ]" )[ 0 ];
	var listItem = image.parentNode;

	list.removeChild( listItem );

	//Remove the bookmarks from extension storage (ie. background)
	chrome.runtime.sendMessage( { action: "removeBookmark", url: url }, function(response) {} );
}


/**************************

  SOURCE-PAGE INTERACTION

***************************/

/*
* insertImageURL inserts the URL of an image into the textfield that the user
* selected in the source page.
*/
function insertImageURL( text )
{
	//activeField is a global variable that is set in the populateLibrary function
	activeField.value = activeField.value + text;
}