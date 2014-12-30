

function init() {
	window.addEventListener("load", windowLoaded, false);
}

function leftPad(n, len) {
    return (new Array(len - String(n).length + 1)).join("0").concat(n);
}

function download2(sfile, dfile)
{
	$.ajax({
		type: "POST",
		url: "http://localhost:31777/d",
		cache: false,
		crossDomain: true,
		data: {filepath: sfile, filename:dfile},
		success: function (resp) {
			chrome.runtime.sendMessage({title: "Complete", message:resp});
		},
		error: function(XMLHttpRequest, textStatus, errorThrown) {
			chrome.runtime.sendMessage({title: "Error", message:"Please Execute Mac Application"});
		}});
}

function getCookie()
{
	chrome.cookies.getAll({}, function(cookie) {
		cook = "";
		for (var i=0; i<cookie.length; i++)
		{
			if (cookie[i]['name'] == "JSESSIONID")
			{
				cook = cookie[i]['value']; 
				return cook;
				break;
			}
		}
	});
}

function download(finfo)
{
	document.cookie = "JSESSIONID="+getCookie();

	$.ajax({
		type: "POST",
		url: "http://portal.unist.ac.kr/EP/web/common/attach/att_get.jsp",
		cache: false,
		crossDomain: true,
		data: {fileinfos: finfo, viewdown:'view', FROMMODULE:'', CT_COMMNAME:'', CT_COMMID:'', CT_KID:'', CT_INDT:'', CT_OWNER:''},
		xhrFields: {
			withCredentials: true
		},
		success: function (resp) {
			resp = resp.substr(resp.indexOf('/wwasdata')+1);
			resp = resp.substr(resp.indexOf('/wwasdata'));
			var tempInfoArr = finfo.split(String.fromCharCode(0x1d));
			download2(resp.substr(0, resp.indexOf(String.fromCharCode(0x1d))) , tempInfoArr[2]);
		}});
}

function setDownInfo(info) {
	var content = "<br/>";
	for (var i=0; i<info.files.length; i++)
	{
		var tempInfoArr = info.files[i].split(String.fromCharCode(0x1d));
		content += "<a id='sInfo"+i+"' style='cursor: pointer;' value='"+info.files[i]+"'>"+(i+1)+". "+tempInfoArr[2]+"</a><br/>";
		//content += (i+1)+". "+tempInfoArr[2]+"<br/>";
		content += "<br/>";
	}
	document.getElementById('sinfos').innerHTML = content;

	for (var i=0; i<info.files.length; i++)
	{
		document.getElementById('sInfo'+i).addEventListener('click', function() {
			download(this.getAttribute("value"));
		});
	}
}

function windowLoaded() {
	chrome.tabs.query({ active:true, currentWindow: true },
		function(tabs) {
			chrome.tabs.sendMessage(
				tabs[0].id,
				{from: 'popup', subject: 'DownInfo'},
				setDownInfo);
		});
}


init();
