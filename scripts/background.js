// Context menu built at install time. Also, check for localStorage capabilities.
chrome.runtime.onInstalled.addListener( function() {
	if ( !Modernizr.localstorage ) 
	{
		alert( "Your broswer is old!\nPlease upgrade your browser to use giftser!" );
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
	//add a name for the bookmark
	var name = prompt( "Enter a name for your bookmark:" );
	
	//replace all shit-disturbing characters with nice ones.
	name = makeSafe( name );

	//store key : value pair. ?? Maybe change this
	localStorage[ url ] = name;

	//send the newly added 
	newImage = [ url, name ];
	chrome.tabs.sendMessage( tab.id, { action: "gifsterAddNewToLibrary", newImage: newImage }, function( response ){} );
};

//makes a string safe to insert into html.
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
	for (var key in localStorage)
	{
		library.push( [ key, localStorage[ key ] ] );
	}

	//sort the library alphabetically by name
	library.sort( function( a, b )
	{
		a = a[1];
		b = b[1];

		//return -1 if a is < b, 1 if a > b, and 0 if they are equal.
		return a < b ? -1 : ( a > b ? 1 : 0 );
	});

	//send the library to the content.js
    chrome.tabs.sendMessage( tab.id, { action: "gifsterShowLibraryUI", library: library }, function( response ){} );
}

