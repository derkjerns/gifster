chrome.runtime.onMessage.addListener( function( request, sender, sendResponse )
	{
		if (request.action == 'showLibraryUI') {
		    showLibraryUI();
		}
	});

function showLibraryUI()
{
	//check if the div has been inserted into the page already.
	var container =  document.getElementById( 'gifsterContainer' );
	if ( container === null )
	{
		//The UI div has not been inserted. Insert it now
		insertLibraryUI();
	}
	else if( container.style.display != 'block' )
	{
		//Display the UI div.
		container.style.display = 'block';
	}
}

function hideLibraryUI()
{
	//This function can only be called through user interaction with the UI div;
	//The UI div has been closed, so let's hide it.
	var container =  document.getElementById( 'gifsterContainer' );

	if( container.style.display != 'none' )
	{
		//Hide the UI div.
		container.style.display = 'none';
	}
}

function insertLibraryUI()
{
	//Prepare DOM for UI div
	document.documentElement.style.height = '100%';
	document.documentElement.style.width = '100%';
	document.body.style.height = '100%';
	document.body.style.width = '100%';

	//Add the css to the page
	var style = document.createElement( 'style' );
	style.type = 'text/css';
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
	'background-color: rgba( 97, 97, 97, 0.5 );' +
	'}' +
	'#gifsterDiv{' +
	'position: fixed;' +
	'top: 10%;' +
	'right: 0px;' +
	'left: 0px;' +
	'margin-right: auto;' +
	'margin-left: auto;' +
	'min-height: 10em;' +
	'width: 90%;' +
	'display: block;' +
	'background-color: rgb( 215, 215, 215 );' +
	'}' +
	'.gifsterButton{' +
	'width: 20px;' +
	'height: 20px;' +
	'position: absolute;' +
	'top: 5px;' +
	'right: 5px;' +
	'background-color: black;' +
	'cursor: pointer;' +
	'}' ;

	document.head.appendChild( style );

	//Create the UI elements
	var container = document.createElement( 'gifsterContainer' );
	var div = document.createElement( 'gifsterDiv' );
	var closeButton = document.createElement( 'gifsterButton' );

	//Append all elements
	document.body.appendChild( container );
	container.appendChild( div );
	div.appendChild( closeButton );

	//Set style for container
	container.id = 'gifsterContainer';

	//Set style for div
	div.id = 'gifsterDiv';

	//Set attributes for btn
	closeButton.className = 'gifsterButton'
	closeButton.onclick = function(){ hideLibraryUI(); };
}