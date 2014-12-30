
chrome.runtime.onMessage.addListener(function(msg, sender) {
	if (msg.from === 'sub')
	{
		chrome.tabs.sendMessage(sender.tab.id, {from: 'background', data:msg.data});
	}
});

chrome.runtime.onMessage.addListener(function(msg, sender) {
	if (msg.title == undefined)
		return;
	if (msg.message == undefined)
		return;
	var opt ={
		type: 'basic',
		title: msg.title,
		message: msg.message,
		iconUrl:'icon.png'
		};
	var randomID = Math.random().toString(36).substring(7);
	chrome.notifications.create(randomID, opt, function(id) { console.log("Last error:", chrome.runtime.lastError); });
});
