chrome.runtime.onMessage.addListener( function( request, sender, sendResponse )
	{
		if ( request.action == "gifsterShowLibraryUI" )
		{
			gifsterShowLibraryUI( request.library );
		}
		else if ( request.action == "gifsterAddNewToLibrary" )
		{
			//Only add a new image if the library has already been initialized.
			if ( gifsterListInit() )
			{
				gifsterAddImageToLibrary( request.newImage );
			}
		}
	});

//jQuery function to test if selector returns nothing
$.fn.exists = function () {
    return this.length !== 0;
}

function gifsterShowLibraryUI( library )
{
	if ( !$( "#gifsterContainer" ).exists() )
	{
		//The UI div has not been inserted. Insert it now
		gifsterInsertLibraryUI( library );
		//Insert the user's gif library to the UI.
		gifsterInsertLibrary( library );
	}
	else if( $( "#gifsterContainer" ).css( "display" ) != "block" )
	{
		//Display the UI div.
		$( "#gifsterContainer" ).css( "display", "block" );
	}
}

function gifsterHideLibraryUI()
{
	if( $( "#gifsterContainer" ).css( "display" ) != "none" )
	{
		$( "#gifsterList" ).scrollTop( 0 );						//Set the scroll position to the top
		$( "#gifsterContainer" ).css( "display", "none" );		//Hide the UI
	}
}

function gifsterInsertLibraryUI()
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
		gifsterHideLibraryUI(); 
	};
}

/**
**	activeField - GLOBAL VARIABLE FOR KEEPING TRACK OF WHICH FIELD TO INSERT URL INTO
**/
var activeField;

function gifsterInsertLibrary( library )
{
	//Set the global variable to the currently selected input field.
	activeField = document.activeElement;
	
	for (var i = 0; i < library.length; i++)
	{
		gifsterAddImageToLibrary( library[ i ] );
	}
}

function gifsterAddImageToLibrary( newImage )
{
	var list = document.getElementById( "gifsterList" );
	var tempListItem = 	document.createElement( "gifsterListItem" );
	var image = document.createElement( "img" );

	tempListItem.className = "gifsterListItem";
	tempListItem.appendChild( image );

	image.className = "lazy";
	image.setAttribute( "data-src", newImage[ 0 ] );
	image.src = chrome.extension.getURL( "images/loading.gif" );
	image.setAttribute( "alt", chrome.extension.getURL( "images/error.png" ) );
	image.width = 220;
	image.height = 220;

	//setting this attr will be used in the onclick function so that gifsterInsertText can insert the url.
	image.setAttribute( "gifsterInsertText", newImage[ 0 ] );

	image.onclick = function()
	{ 
		//We want to close the window after an image has been chosen.
		gifsterHideLibraryUI();
		//Obviously we also want the image url to be inserted.
		gifsterInsertText( this.getAttribute( "gifsterInsertText" ) );
	};
	//append the thumbnail to the list.
	list.appendChild( tempListItem );

	$( image ).lazy({
		bind: "event",
		enableThrottle: true,
	    throttle: 250,
	    effect: "fadeIn",
	    effectTime: 1000,
	    onError: function( image )
	    {
	    	//if the image could not be loaded, this function is called
	    	image.attr( "src", image.attr( "alt" ) );
	    	image.onclick = function()
	    	{
	    		this.css( "display", "none" );
	    	}
	    }
	});
}

function gifsterInsertText( text )
{
	//activeField is a global variable that is set in the gifsterInsertLibrary function
	activeField.value = activeField.value + text;
}