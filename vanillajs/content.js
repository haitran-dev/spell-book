console.log('content script');

const CAMBRIDGE_DOMAIN = 'https://dictionary.cambridge.org';
const ROOT_ID = 'visual-english-root';

const extractData = (sourceContent) => {
	const dom = new DOMParser().parseFromString(sourceContent, 'text/html');
	if (!dom) return null;

	const meaningScopeEle = dom.querySelector('.entry-body__el');
	if (!meaningScopeEle) return null;

	const type = meaningScopeEle.querySelector('.pos.dpos')?.textContent;

	// meaning
	const meanings = [];
	const meaningBlocks = meaningScopeEle.querySelectorAll('[data-wl-senseid]');

	for (let block of meaningBlocks) {
		const meaningEle = block.querySelector('.ddef_d');

		if (meaningEle) {
			let examples = [];

			const meaningText = meaningEle.textContent;
			const meaningExamplesEle = [...block.querySelectorAll('.eg.deg')];

			if (meaningExamplesEle.length > 0) {
				meaningExamplesEle.forEach((example) => {
					example && examples.push(example.textContent);
				});
			}

			meanings.push({
				text: meaningText,
				examples,
			});
		}
	}

	// audio
	let audio = {};
	const audioUSEle = meaningScopeEle.querySelector('#audio2');
	if (audioUSEle) {
		audio.us = {
			mp3:
				CAMBRIDGE_DOMAIN +
				audioUSEle.querySelector('[type="audio/mpeg"]')?.getAttribute('src'),
			ogg:
				CAMBRIDGE_DOMAIN +
				audioUSEle.querySelector('[type="audio/ogg"]')?.getAttribute('src'),
		};
	}

	const audioUKEle = meaningScopeEle.querySelector('#audio1');
	if (audioUKEle) {
		audio.uk = {
			mp3:
				CAMBRIDGE_DOMAIN +
				audioUKEle.querySelector('[type="audio/mpeg"]')?.getAttribute('src'),
			ogg:
				CAMBRIDGE_DOMAIN +
				audioUKEle.querySelector('[type="audio/ogg"]')?.getAttribute('src'),
		};
	}

	return {
		type,
		audio,
		meanings,
	};
};

const initSideCompanion = () => {
	// let root = document.getElementById(ROOT_ID);
	// if (!root) {
	// 	root = document.createElement('div');
	// 	root.id = ROOT_ID;
	// 	document.body.appendChild(root);
	// }
	// const buffer = document.createElement('div');
	// buffer.className = 'visual-english-root'

	const iframe = document.createElement('iframe');
	iframe.id = ROOT_ID;
	iframe.src = chrome.runtime.getURL('iframe.html');
	document.body.appendChild(iframe);
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'select') {
		let { word, sourceContent } = request.data;

		const data = extractData(sourceContent);

		initSideCompanion(word, data);
	}
});
