chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: 'selection',
		title: 'Magic dictionary',
		contexts: ['selection'],
	});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	const word = info.selectionText;

	fetch(`https://dictionary.cambridge.org/dictionary/english/${word}`, {
		method: 'GET',
		credentials: 'omit',
	})
		.then((response) => response.text())
		.then((sourceContent) => {
			chrome.tabs.sendMessage(tab.id, {
				action: 'select',
				data: { word, sourceContent },
			});
		});
});
