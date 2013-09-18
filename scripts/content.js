/**************************

		LISTENERS

***************************/

chrome.runtime.onMessage.addListener( function( request, sender, sendResponse )
	{
		if ( request.action == "showLibrary" )
		{
			showLibrary( request.library );
		}
		else if ( request.action == "addBookmark" )
		{
			//Only add a new image if the library has already been initialized.
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

//activeField - Global variable for keeping track of which textfield to insert the url into.
var activeField;


/**************************

		UI VISIBILITY

***************************/

function showLibrary( library )
{
	if ( !$( "#gifsterContainer" ).exists() )
	{
		//The UI div has not been inserted. Insert it now
		createLibrary( library );
		//Insert the user's gif library to the UI.
		populateLibrary( library );
	}
	else if( $( "#gifsterContainer" ).css( "display" ) != "block" )
	{
		//Display the UI div.
		$( "#gifsterContainer" ).css( "display", "block" );
	}
}

function hideLibrary()
{
	if( $( "#gifsterContainer" ).css( "display" ) != "none" )
	{
		//Set the scroll position to the top
		$( "#gifsterList" ).scrollTop( 0 );
		//Hide the UI		
		$( "#gifsterContainer" ).css( "display", "none" );
	}
}


/**************************

	  UI CREATION

***************************/

function createLibrary()
{
	//Prepare DOM for UI div
	$( "html" ).css( "height", "100%" );
	$( "html" ).css( "width", "100%" );
	$( "body" ).css( "height", "100%" );
	$( "body" ).css( "width", "100%" );

	//Add the css to the page
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

	//This adds the css to the page head
	document.head.appendChild( style );

	//Create the UI elements
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

	//Set style for container
	container.id = "gifsterContainer";

	//Set style for div
	div.id = "gifsterDiv";

	//Set attributes for logo
	logo.id = "gifsterLogo";
	logo.src = chrome.extension.getURL("images/icon_128.png");

	//Set style for list
	list.id = "gifsterList";

	//Set attributes for btn
	closeButton.className = "gifsterButton";
	closeButton.src = chrome.extension.getURL("images/close_button.png");
	closeButton.onclick = function()
	{ 
		//This button cancels the action by closing the window 
		hideLibrary(); 
	};
}


/**************************

		IMAGE LIBRARY

***************************/

function populateLibrary( library )
{
	//Set the global variable to the currently selected input field.
	activeField = document.activeElement;
	
	for (var i = 0; i < library.length; i++)
	{
		addBookmark( library[ i ] );
	}
}

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

	//setting this attr will be used in the onclick function so that gifsterImageURL can insert the url.
	image.setAttribute( "gifsterImageURL", newImage );

	//insert the thumbnail to the front of the list.
	list.insertBefore( tempListItem, list.firstChild );

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
				//Obviously we also want the image url to be inserted.
				insertImageURL( this.getAttribute( "gifsterImageURL" ) );
    		});
	    },
	    onError: function( element )
	    {
	    	removeBookmark( element.attr( "gifsterImageURL" ) );
	    }
	});
}

function removeBookmark( badUrl )
{
	var list = document.getElementById( "gifsterList" );
	var image = $( "img[ gifsterImageURL = '" + badUrl + "' ]" )[ 0 ];
	var listItem = image.parentNode;

	list.removeChild( listItem );

	//Remove the bookmarks from extension storage
	chrome.runtime.sendMessage( { action: "removeBookmark", badUrl: badUrl }, function(response) {} );
}


/**************************

  SOURCE-PAGE INTERACTION

***************************/

function insertImageURL( text )
{
	//activeField is a global variable that is set in the populateLibrary function
	activeField.value = activeField.value + text;
}