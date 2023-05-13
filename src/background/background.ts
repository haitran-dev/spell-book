const fetchMeaning = async (word: string) => {
	const response = await fetch(`https://dictionary.cambridge.org/dictionary/english/${word}`, {
		method: 'GET',
		credentials: 'omit',
	});

	return response.text();
};

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: 'selection',
		title: 'Cast spell on "%s"',
		contexts: ['selection'],
	});
});

chrome.runtime.onMessage.addListener(async (message) => {
	// const message = event.data;
	if (message.action === 'select-popup') {
		const sourceContent = await fetchMeaning(message.text);

		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			const tabId = tabs[0].id;

			chrome.tabs.sendMessage(tabId, {
				action: 'select',
				data: { word: message.text, sourceContent },
			});
		});
	}
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	const word = info.selectionText.trim();

	const sourceContent = await fetchMeaning(word);

	chrome.tabs.sendMessage(tab.id, {
		action: 'select',
		data: { word, sourceContent },
	});
});
