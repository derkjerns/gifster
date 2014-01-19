/**************************

		LISTENERS

***************************/

// Context menu built at install/update time.
//Check for localStorage capabilities.
//Re-run content scripts to update any open tabs.
chrome.runtime.onInstalled.addListener( function(details) {

	chrome.tabs.query({}, function(tabs) {
		for (var i=0; i<tabs.length; i++) {
			chrome.tabs.executeScript(tabs[i].id, {file: 'scripts/jquery-1.10.2.min.js'});
			chrome.tabs.executeScript(tabs[i].id, {file: 'scripts/jquery.lazy.min.js'});
			chrome.tabs.executeScript(tabs[i].id, {file: 'scripts/content.js'});
		}
	});

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
			removeBookmark( request.url );
		}
	});

//listen for context menu clicks
chrome.contextMenus.onClicked.addListener( function( info, tab )
	{
		contextClickHandler( info, tab );
	});

/**************************

	  GOOGLE ANALYTICS

***************************/

var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-45765110-1']);

(function() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();


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
	if ( localStorage.getItem( "0" ) === null )
	{
		//initialize the index # to 1.
		localStorage.setItem( "0", "1" );
	}

	//get the next unused index number
	var currentIndex = localStorage.getItem( "0" );
	//localStorage stores everything as strings, add leading zeroes to ensure proper storage order.
	var numZeroes = 9 - currentIndex.length;
	//add the leading zeroes
	for( var i = 0; i < numZeroes; i++ )
	{
		currentIndex = "0" + currentIndex;
	}

	//store the url
	localStorage.setItem( currentIndex, url );
 	//increment the index.
	var newIndex = parseInt( localStorage.getItem( "0" ), 10 ) + 1;
	localStorage.setItem( "0" , newIndex.toString() );
	
	//update content.js with the newly added image
	chrome.tabs.query({}, function(tabs) {
		for (var i=0; i<tabs.length; i++) {
			chrome.tabs.sendMessage( tabs[i].id, { action: "addBookmark", newImage: url }, function( response ){});
		}
	});
}


/**************************

	INSERT IMAGE ACTION

***************************/

/*
* insertImage action sends the entire library of images to content.js
* so that they can be displayed to the user.
*/
function insertImage( tab )
{

	//Analytics tracking to see how often people are using the extension
	_gaq.push(['_trackPageview']);
	_gaq.push(['_trackEvent', 'library view', 'insert image']);

	var donate = false;
	var reminderInterval = 10;

    if ( localStorage.getItem( "donate" ) === null )
    {
        //initialize the donate reminder to 1
        localStorage.setItem( "donate", "1" );
    }
    else if( parseInt( localStorage.getItem( "donate" ), 10 ) <= reminderInterval )
    {
    	var newValue = parseInt( localStorage.getItem( "donate" ), 10 ) + 1;
        localStorage.setItem( "donate", newValue.toString() );
    }
    else
    {
        donate = true;
        localStorage.setItem( "donate", "1" );
    }

	//an array to contain all of the image urls.
	var library = [];
	//temp variables for holding localStorage values.
	var tempKey;
	var tempItem;
	//Add each localStorage item into an array (except for localStorage[ 0 ])
	for ( var i = 0; i < localStorage.length; i++ )
	{
		tempKey = localStorage.key( i )
		if ( tempKey != "0" && tempKey != "donate" )
		{
			tempItem = localStorage.getItem( tempKey );
			library.push( tempItem );
		}

	}

	//send the library to content.js
    chrome.tabs.sendMessage( tab.id, { action: "showLibrary", library: library, donate: donate }, function( response ){return null;} );
}

/**************************

   REMOVE BOOKMARK ACTION

***************************/

/*
* removeBookmark removes a bookmark from localStorage
*/
function removeBookmark( url )
{
	//iterate through each localStorage item until the index for the url is found
	for ( var i = 1; i < localStorage.length; i++ )
	{
		//temporarily store the ith key
		var key = localStorage.key( i );
		//check if the value at the ith index is the badUrl
		if ( url == localStorage.getItem( key ) )
		{
			//remove the key:value pair
			localStorage.removeItem( key );
			break;
		}
	}

	//update content.js with the removed image
	chrome.tabs.query({}, function(tabs) {
		for (var i=0; i<tabs.length; i++) {
			chrome.tabs.sendMessage( tabs[i].id, { action: "removeBookmark", url: url }, function( response ){});
		}
	});
}

