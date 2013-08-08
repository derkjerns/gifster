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
		addBookmark( info.srcUrl );
	}
	else if ( info.menuItemId == "insert" )
	{
		insertImage( tab );
	}
};


/**************************

	ADD BOOKMARK ACTION

***************************/
function addBookmark( url )
{
	//add a name for the bookmark
	var name = prompt( "Enter a name for your bookmark:" );
	
	//replace all shit-disturbing characters with nice ones.
	name = makeSafe( name );

	//store key : value pair. ?? Maybe change this
	localStorage[ url ] = name;
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
	//THIS INSERTS TEXT INTO THE ACTIVE ELEMENT (IE TEXTFIELD)
	var text = "HELLO!";
	var insertText = "var text, field;" +
					 "field = document.activeElement;"+
				     "text = \""+text+"!\";" +
				     "field.value = field.value + text;";
	
	chrome.tabs.executeScript( null, { code: insertText } );

    	
    chrome.tabs.sendMessage( tab.id, { action: "showLibraryUI" }, function( response ){} );

	//iterate through each local storage item
	for (var key in localStorage)
	{
		/*var name = localStorage.getItem(key);
		var temp = "<h2>"+name+"</h2><img src=\""+key+"\" alt=\""+name+"\"/><br/>";
		chrome.tabs.executeScript(null, 
			{code:"document.body.innerHTML += '"+temp+"';"});*/
	}
}

