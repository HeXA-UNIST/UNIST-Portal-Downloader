
chrome.runtime.onMessage.addListener(function(msg, sender) {
	if (msg.from === 'sub')
	{
		chrome.tabs.sendMessage(sender.tab.id, {from: 'background', data:msg.data});
	}
});

chrome.runtime.onMessage.addListener(function(msg, sender) {
	if (msg.message == undefined)
		return;
	var opt ={
		type: 'basic',
		title: 'Complete',
		message: msg.message,
		iconUrl:'icon.png'
		};
	chrome.notifications.create('notify1', opt, function(id) { console.log("Last error:", chrome.runtime.lastError); });
});
