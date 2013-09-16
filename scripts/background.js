// Context menu built at install time. Also, check for localStorage capabilities.
chrome.runtime.onInstalled.addListener( function() {

	if ( !Modernizr.localstorage ) 
	{
		alert( "Please upgrade your browser to use giftser!\nGet Chrome here:\n\nhttps://www.google.com/intl/en/chrome/browser/" );
	}
	chrome.contextMenus.create( { "title": "Bookmark image", "contexts":[ "image" ], "id": "bookmark" } );
	chrome.contextMenus.create( { "title": "Insert image", "contexts":[ "editable" ], "id": "insert" } );
});

//listen for context menu clicks
chrome.contextMenus.onClicked.addListener( function( info, tab )
	{
		contextClickHandler( info, tab );
	});

function contextClickHandler( info, tab ) 
{
	if ( info.menuItemId == "bookmark" )
	{
		// info.srcUrl is the image source url ... convenient :[
		addBookmark( info.srcUrl, tab );
	}
	else if ( info.menuItemId == "insert" )
	{
		insertImage( tab );
	}
};


/**************************

	ADD BOOKMARK ACTION

***************************/
function addBookmark( url, tab )
{
	if ( localStorage[ 0 ] == null )
	{
		localStorage [ 0 ] = 1;
	}

	var currentIndex = localStorage[ 0 ];

	localStorage[ currentIndex ] = url;

	localStorage[ 0 ] = 1 * currentIndex + 1;

	//send the newly added 
	newImage = url;
	chrome.tabs.sendMessage( tab.id, { action: "gifsterAddNewToLibrary", newImage: newImage }, function( response ){} );
};

//Not currently being used -- Makes a string safe to insert into html.
function makeSafe( str ) 
{
	str = str.trim();
	str = str.replace( '&', "&amp;" ).replace( '"', "&quot;" ).replace( "'", "&#39;" ).replace( '>', "&gt;" ).replace( '<', "&lt;" );
    return str;
};


/**************************

	INSERT IMAGE ACTION

***************************/
function insertImage( tab )
{
	var library = [];

	//Add each localstorage item into an array
	for ( var i = 1; i < localStorage.length; i++ )
	{
		library.push( localStorage.getItem( localStorage.key( i ) ) );
	}

	//send the library to the content.js
    chrome.tabs.sendMessage( tab.id, { action: "gifsterShowLibraryUI", library: library }, function( response ){} );
}

