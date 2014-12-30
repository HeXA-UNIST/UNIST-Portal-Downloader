if (!window.isTop) {
	var sinfo = document.getElementById("sInfo0");
	if (sinfo != null)
	{
		sinfos = new Array();
		var i = 0;
		while (sinfo != null) {
			sinfos[i++] = sinfo.value;
			sinfo = document.getElementById("sInfo"+i);
		}
		chrome.runtime.sendMessage({from:'sub', data:sinfos});
	}
}
