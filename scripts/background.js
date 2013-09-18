/**************************

		LISTENERS

***************************/

// Context menu built at install time. Also, check for localStorage capabilities.
chrome.runtime.onInstalled.addListener( function() {

	if ( !Modernizr.localstorage ) 
	{
		alert( "Please upgrade your browser to use giftser!\nGet Chrome here:\n\nhttps://www.google.com/intl/en/chrome/browser/" );
	}
	chrome.contextMenus.create( { "title": "Bookmark image", "contexts":[ "image" ], "id": "bookmark" } );
	chrome.contextMenus.create( { "title": "Insert image", "contexts":[ "editable" ], "id": "insert" } );
});

//Listener required to receive messages from content.js
chrome.runtime.onMessage.addListener( function( request, sender, sendResponse )
	{
		//a request to remove a broken link from the localStorage
		if ( request.action == "removeBookmark" )
		{
			removeBookmark( request.badUrl );
		}
	});

//listen for context menu clicks
chrome.contextMenus.onClicked.addListener( function( info, tab )
	{
		contextClickHandler( info, tab );
	});


/**************************

	  HELPER FUNCTIONS

***************************/

/*
* contextClickHandler carries out actions based on context menu clicks.
*/
function contextClickHandler( info, tab ) 
{
	//Check if the "bookmark" context menu options was clicked
	if ( info.menuItemId == "bookmark" )
	{
		// info.srcUrl is the image source url ... convenient :[
		addBookmark( info.srcUrl, tab );
	}
	//Check if the "insert" context menu options was clicked
	else if ( info.menuItemId == "insert" )
	{
		insertImage( tab );
	}
};

/*
* makeSafe makes a string safe to insert into html.
* -- Not currently being used -- 
*/
function makeSafe( str ) 
{
	str = str.trim();
	str = str.replace( '&', "&amp;" ).replace( '"', "&quot;" ).replace( "'", "&#39;" ).replace( '>', "&gt;" ).replace( '<', "&lt;" );
    return str;
};

/*
* isUnique checks if a url has already been added as a bookmark (prevent duplicates).
*/
function isUnique( url ) 
{
	//iterate through each localStorage item (except localStorage[ 0 ])
	for ( var i = 1; i < localStorage.length; i++ )
	{
		//check if the url is the same as a url in localStorage
		if( url == localStorage.getItem( localStorage.key( i ) ) )
		{
			//not unique 
			return false;
		}
	}
	//unique
	return true;
}


/**************************

		  ACTIONS

***************************/
/**************************

	ADD BOOKMARK ACTION

***************************/

/*
* addBookmark adds an image url to localStorage and updates content.js with the new bookmark.
*/
function addBookmark( url, tab )
{
	//check if the url is a duplicate bookmark.
	if( !isUnique( url ) )
	{
		//if not unique, exit the function
		return null;
	}
	//localStorage[ 0 ] is used to keep an incrementing index for bookmarks.
	if ( localStorage[ 0 ] == null )
	{
		//initialized the index # to 1.
		localStorage [ 0 ] = 1;
	}
	//get the next unused index number
	var currentIndex = localStorage[ 0 ];
	//store the url
	localStorage[ currentIndex ] = url;
	//increment the index.
	//Note: the "*" is required because javascript.
	localStorage[ 0 ] = 1 * currentIndex + 1;
	//update content.js with the newly added image
	chrome.tabs.sendMessage( tab.id, { action: "addBookmark", newImage: url }, function( response ){} );
};


/**************************

	INSERT IMAGE ACTION

***************************/

/*
* insertImage action sends the entire library of images to content.js
* so that they can be displayed to the user.
*/
function insertImage( tab )
{
	//an array to contain all of the image urls.
	var library = [];
	//Add each localStorage item into an array (except for localStorage[ 0 ])
	for ( var i = 1; i < localStorage.length; i++ )
	{
		library.push( localStorage.getItem( localStorage.key( i ) ) );
	}
	//send the library to content.js
    chrome.tabs.sendMessage( tab.id, { action: "showLibrary", library: library }, function( response ){} );
}

/**************************

   REMOVE BOOKMARK ACTION

***************************/

/*
* removeBookmark removes a bookmark from localStorage
*/
function removeBookmark( badUrl )
{
	//iterate through each localStorage item until the index for the badUrl is found
	for ( var i = 1; i < localStorage.length; i++ )
	{
		//temporarily store the ith key
		var key = localStorage.key( i );
		//check if the value at the ith index is the badUrl
		if ( badUrl == localStorage.getItem( key ) )
		{
			//remove the key:value pair
			localStorage.removeItem( key );
			break;
		}
	}
}

