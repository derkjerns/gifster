// Context menu built at install time. Also, check for localStorage capabilities.
chrome.runtime.onInstalled.addListener(function() {
	if (!Modernizr.localstorage) 
	{
		alert("Your broswer is old!\nPlease upgrade your browser to use giftser!");
	}
	chrome.contextMenus.create({"title": "Bookmark image", "contexts":["image"], "id": "bookmark"});
	chrome.contextMenus.create({"title": "Insert image", "contexts":["editable"], "id": "insert"});
});

//listen for context menu clicks
chrome.contextMenus.onClicked.addListener(contextClickHandler);

function contextClickHandler(info, tab) 
{
	if ( info.menuItemId == "bookmark" )
	{
		// info.srcUrl is the image source url ... convenient :[
		addBookmark(info.srcUrl);
	}
	else if ( info.menuItemId == "insert" )
	{
		insertImage();
	}
};


/**************************

	ADD BOOKMARK ACTION

***************************/
function addBookmark( url )
{
	//add a name for the bookmark
	var name = prompt("Enter a name for your bookmark:");
	
	//replace all shit-disturbing characters with nice ones.
	name = makeSafe(name);

	//store key : value pair. ?? Maybe change this
	localStorage[url] = name;
};

//makes a string safe to insert into html.
function makeSafe( str ) 
{
	str = str.trim();
	str = str.replace('&', "&amp;").replace('"', "&quot;").replace("'", "&#39;").replace('>', "&gt;").replace('<', "&lt;");
    return str;
};


/**************************

	INSERT IMAGE ACTION

***************************/
function insertImage()
{
	//runs javascript code to clear the body contents ... just for kicks atm.
	chrome.tabs.executeScript(null, 
		{code:"document.body.innerHTML = '';"});

	//iterate through each local storage item
	for (var key in localStorage)
	{
		var name = localStorage.getItem(key);
		var temp = "<h2>"+name+"</h2><img src=\""+key+"\" alt=\""+name+"\"/><br/>";
		chrome.tabs.executeScript(null, 
			{code:"document.body.innerHTML += '"+temp+"';"});
	}
}

