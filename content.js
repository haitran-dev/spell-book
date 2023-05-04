console.log('content script');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'select') {
		let selectionText = request.selectionText;

		// script
		console.log('ele', document.getSelection());
	}
});
