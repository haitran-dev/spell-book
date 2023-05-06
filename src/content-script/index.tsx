import React from 'react';
import ReactDOM from 'react-dom/client';
import '../assets/tailwind.css';
import './root.css';
import App from './App';

const CAMBRIDGE_DOMAIN = 'https://dictionary.cambridge.org';
const ROOT_ID = 'visual-english-ext';
let currentWords = [];

const extractData = (sourceContent: string, word: string) => {
	const dom = new DOMParser().parseFromString(sourceContent, 'text/html');
	if (!dom) return null;

	const meaningScopeEle = dom.querySelector('.entry-body__el');
	if (!meaningScopeEle) return null;

	const title = meaningScopeEle.querySelector('.di-title')?.textContent ?? word;
	const type = meaningScopeEle.querySelector('.pos.dpos')?.textContent;

	// meaning
	const meanings = [];
	const meaningBlocks = meaningScopeEle.querySelectorAll('[data-wl-senseid]');

	meaningBlocks.forEach((block) => {
		const meaningEle = block.querySelector('.ddef_d');

		if (meaningEle) {
			let examples = [];

			const meaningText = meaningEle.textContent;

			block.querySelectorAll('.eg.deg').forEach((example) => {
				example && examples.push(example.textContent);
			});

			meanings.push({
				text: meaningText,
				examples,
			});
		}
	});

	// audio
	let audios = [];
	const audioUSEle = meaningScopeEle.querySelector('#audio2');
	if (audioUSEle) {
		audios.push({
			type: 'us',
			sources: [
				{
					type: 'audio/mpeg',
					url:
						CAMBRIDGE_DOMAIN +
						audioUSEle.querySelector('[type="audio/mpeg"]')?.getAttribute('src'),
				},
				{
					type: 'audio/ogg',
					url:
						CAMBRIDGE_DOMAIN +
						audioUSEle.querySelector('[type="audio/ogg"]')?.getAttribute('src'),
				},
			],
		});
	}

	const audioUKEle = meaningScopeEle.querySelector('#audio1');
	if (audioUKEle) {
		audios.push({
			type: 'uk',
			sources: [
				{
					type: 'audio/mpeg',
					url:
						CAMBRIDGE_DOMAIN +
						audioUKEle.querySelector('[type="audio/mpeg"]')?.getAttribute('src'),
				},
				{
					type: 'audio/ogg',
					url:
						CAMBRIDGE_DOMAIN +
						audioUKEle.querySelector('[type="audio/ogg"]')?.getAttribute('src'),
				},
			],
		});
	}

	return {
		title,
		type,
		audios,
		meanings,
	};
};

const handlePopTab = () => {
	currentWords.pop();
};

const handleClear = (node) => {
	currentWords = [];
	node.style.animation = 'slideOut 300ms ease-in';
	setTimeout(() => {
		node.replaceChildren();
		node.style.animation = null;
	}, 300);
};

const initApp = (data: object) => {
	let container = document.querySelector(`#${ROOT_ID}`);

	if (!container) {
		container = document.createElement('div');
		container.id = ROOT_ID;
		document.body.appendChild(container);
	}

	const tab = document.createElement('div');
	container.appendChild(tab);
	const root = ReactDOM.createRoot(tab);

	data &&
		root.render(
			<App data={data} onGoBack={handlePopTab} onClose={() => handleClear(container)} />
		);
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'select') {
		let { word, sourceContent } = request.data;

		if (currentWords.length > 0 && currentWords[currentWords.length - 1] === word) return;
		currentWords.push(word);

		const data = extractData(sourceContent, word);

		initApp(data);
	}
});
