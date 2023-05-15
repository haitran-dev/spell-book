const fetchMeaning = async (word: string) => {
	const response = await fetch(`https://dictionary.cambridge.org/dictionary/english/${word}`, {
		method: 'GET',
		credentials: 'omit',
	});

	return response.text();
};

const fetchImages = async (word: string) => {
	const response = await fetch(`https://www.google.com/search?q=${word}+illustration&tbm=isch`, {
		method: 'GET',
		credentials: 'omit',
	});

	return response.text();
};

chrome.runtime.onMessage.addListener(async (message) => {
	// const message = event.data;

	console.log({ message });

	if (message.action === 'select-popup') {
		const sourceContent = await fetchMeaning(message.text);

		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			const tabId = tabs[0].id;
			console.log({ tabId });

			chrome.tabs.sendMessage(tabId, {
				action: 'select',
				data: { word: message.text, sourceContent },
			});
		});
	}

	if (message.action === 'fetch-images') {
		const sourceImages = await fetchImages(message.text);

		chrome.windows.getCurrent((w) => {
			chrome.tabs.query({ active: true, windowId: w.id }, function (tabs) {
				const tabId = tabs[0].id;
				console.log({ tabId });

				chrome.tabs.sendMessage(tabId, {
					action: 'response-images',
					data: { sourceImages },
				});
			});
		});
	}
});

// context menu

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: 'selection',
		title: 'Cast spell on "%s"',
		contexts: ['selection'],
	});
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
	const word = info.selectionText.trim();

	const sourceContent = await fetchMeaning(word);
	const sourceImages = await fetchImages(word);

	chrome.tabs.sendMessage(tab.id, {
		action: 'select',
		data: { word, sourceContent, sourceImages },
	});
});
