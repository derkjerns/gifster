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
		//Set the scroll position to the top to prepare for the next time the UI is displayed.
		$( "#gifsterList" ).scrollTop( 0 );
		//Hide the UI		
		$( "#gifsterContainer" ).css( "display", "none" );
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
	'height: 470px;' +
	'width: 500px;' +
	'display: block;' +
	'background-color: rgb( 255, 255, 255 );' +
	'}' +
	'#gifsterLogo{' +
	'display: block;' +
	'padding: 10px;' +
	'width: 40px;' +
	'height: 40px;' +
	'}' +
	'.gifsterButton{' +
	'width: 20px;' +
	'height: 20px;' +
	'position: absolute;' +
	'top: 10px;' +
	'right: 10px;' +
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
	'margin-top: 60px;' +
	'margin-bottom: auto;' +
	'overflow-y: auto;' +
	'background-color: rgb( 235, 235, 235 );' +
	'}' +
	'.gifsterListItem{' +
	'font: 15px;' +
	'color: black;' +
	'width: 220px;' +
	'height: 220px;' +
	'display: inline-block;' +
	'padding: 10px;' +
	'cursor: pointer;' +
	'}';

	//Add the css to the source page head element
	document.head.appendChild( style );

	//Create the UI dom elements
	var container = document.createElement( "gifsterContainer" );
	var div = document.createElement( "gifsterDiv" );
	var logo = document.createElement( "img" );
	var list = document.createElement( "gifsterList" );
	var closeButton = document.createElement( "img" );

	//Append all elements
	document.body.appendChild( container );
	container.appendChild( div );
	div.appendChild( list );
	div.appendChild( logo );
	div.appendChild( closeButton );

	//Set styles and attributes for elements
	//container
	container.id = "gifsterContainer";
	//div
	div.id = "gifsterDiv";
	//logo
	logo.id = "gifsterLogo";
	logo.src = chrome.extension.getURL("images/icon_128.png");
	//list
	list.id = "gifsterList";
	//closeButton
	closeButton.className = "gifsterButton";
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
	var tempListItem = 	document.createElement( "gifsterListItem" );
	var image = document.createElement( "img" );

	tempListItem.className = "gifsterListItem";
	tempListItem.appendChild( image );

	image.className = "lazy";
	image.setAttribute( "data-src", newImage );
	image.src = chrome.extension.getURL( "images/loading.gif" );
	image.setAttribute( "alt", "Gifster image" );
	image.width = 220;
	image.height = 220;

	//This attr will be used in the onclick function so that gifsterImageURL 
	//can be inserted into the active field in the source page
	image.setAttribute( "gifsterImageURL", newImage );

	//insert the thumbnail to the front of the list.
	list.insertBefore( tempListItem, list.firstChild );

	//initiate lazy loading
	$( image ).lazy({
		bind: "event",
		enableThrottle: true,
	    throttle: 250,
	    effect: "fadeIn",
	    effectTime: 1000,
	    afterLoad: function( element )
	    {
    		element.on( "click", function()
    		{
				//We want to close the window after an image has been chosen.
				hideLibrary();
				//We also want the image url to be inserted.
				insertImageURL( this.getAttribute( "gifsterImageURL" ) );
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
function removeBookmark( badUrl )
{
	var list = document.getElementById( "gifsterList" );
	var image = $( "img[ gifsterImageURL = '" + badUrl + "' ]" )[ 0 ];
	var listItem = image.parentNode;

	list.removeChild( listItem );

	//Remove the bookmarks from extension storage (ie. background)
	chrome.runtime.sendMessage( { action: "removeBookmark", badUrl: badUrl }, function(response) {} );
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