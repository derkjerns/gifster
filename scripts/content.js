chrome.runtime.onMessage.addListener( function( request, sender, sendResponse )
	{
		if (request.action == 'showLibraryUI') {
		    showLibraryUI();
		}
	});

function showLibraryUI()
{
	//check if the div has been inserted into the page already.
	var div =  document.getElementById( 'gifsterDiv' );
	if ( div === null )
	{
		//The UI div has not been inserted. Insert it now
		insertLibraryUI();
	}
	else if( div.style.display != 'block' )
	{
		//Display the UI div.
		div.style.display = 'block';
	}
}

function hideLibraryUI()
{
	//This function can only be called through user interaction with the UI div;
	//The UI div has been closed, so let's hide it.
	var div =  document.getElementById( 'gifsterDiv' );

	if( div.style.display != 'none' )
	{
		//Hide the UI div.
		div.style.display = 'none';
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
	'background-color: red;' +
	'}';
	document.head.appendChild( style );

	//Create the UI elements
	var div = document.createElement( 'gifsterDiv' );
	var btnForm = document.createElement( 'form' );
	var btn = document.createElement( 'input' );

	//Append all elements
	document.body.appendChild( div );
	div.appendChild( btnForm );
	btnForm.appendChild( btn );

	//Set style for div
	div.id = 'gifsterDiv';

	//TODO: FIX Port: Could not establish connection. Receiving end does not exist. 

	//Set attributes for btnForm
	btnForm.action = '';

	//Set attributes for btn
	btn.type = 'button';
	btn.value = 'X';
	btn.style.position = 'absolute';
	btn.style.top = '3px';
	btn.style.right = '3px';
	btn.onclick = function(){ hideLibraryUI(); };
}