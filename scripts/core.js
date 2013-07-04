// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

$(document).ready(function(){
	init();
});

function init()
{
	$("#getThem").click(function(){
        console.log("test");
        //more code here...
    });
}

// The onClicked callback function.
function onClickHandler(info, tab) {
	if ( info.menuItemId == "bookmark" )
	{
		alert("BOOKMARK AN IMAGE ACTION");
	}
	else if ( info.menuItemId == "insert" )
	{
		alert("INSERT AN IMAGE ACTION");
	}
};

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({"title": "Bookmark image", "contexts":["image"], "id": "bookmark"});
    chrome.contextMenus.create({"title": "Insert image", "contexts":["editable"], "id": "insert"});
});

function getAll()
{
	console.log("gotem'");
}


