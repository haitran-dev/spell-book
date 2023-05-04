chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: 'selection',
		title: 'Magic dictionary',
		contexts: ['selection'],
	});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	fetch(`https://dictionary.cambridge.org/dictionary/english/query`, {
		method: 'GET',
		credentials: 'omit',
	})
		.then((response) => response.text())
		.then((text) => {
			console.log({ text });
		});

	chrome.tabs.sendMessage(tab.id, { action: 'select', selectionText: info.selectionText });
});
