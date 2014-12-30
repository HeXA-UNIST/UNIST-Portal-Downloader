
var isTop = true;

var current_files = '';
chrome.runtime.onMessage.addListener(function(msg, sender, response) {
	if ((msg.from === 'popup') && (msg.subject ==='DownInfo'))
	{
		var downInfo = { files: current_files };

		response(downInfo);
	}
	else if (msg.from == 'background')
	{
		current_files = msg.data;
	}
});
