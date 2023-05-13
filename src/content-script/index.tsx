import React from 'react';
import ReactDOM from 'react-dom/client';
import '../assets/tailwind.css';
import { extractData } from '../helpers/data-collect';
import App from './App';
import './root.css';

const ROOT_ID = 'visual-english-ext';
const TRIGGER_ROOT_ID = 'spell-book-ext-selection-point';
let currentWords = [];

const handlePopTab = (root, container) => {
	currentWords.pop();
	setTimeout(() => {
		root.unmount();

		if (currentWords.length === 0) {
			container.style.transform = 'translateX(101%)';
		}
	}, 300);
};

const handleClear = (node) => {
	currentWords = [];
	node.style.transform = 'translateX(101%)';
	setTimeout(() => {
		node.replaceChildren();
	}, 300);
};

const initApp = (data: object) => {
	let container: HTMLElement = document.querySelector(`#${ROOT_ID}`);

	if (!container) {
		container = document.createElement('div');
		container.id = ROOT_ID;
		document.body.appendChild(container);
	}

	container.style.transform = 'translateX(0%)';
	const tab = document.createElement('div');
	container.appendChild(tab);
	const root = ReactDOM.createRoot(tab);

	root.render(
		<App
			root={container}
			data={data}
			onGoBack={() => handlePopTab(root, container)}
			onClose={() => handleClear(container)}
			isFirstChild={currentWords.length === 1}
		/>
	);
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === 'select') {
		let { word, sourceContent } = request.data;

		const data = extractData(sourceContent, word);

		if (!data) return;

		if (currentWords.length > 0 && currentWords[currentWords.length - 1] === word) return;
		currentWords.push(word);

		initApp(data);
	}
});

let reactTriggerRoot;
let isMounted = false;

const handleTrigger = (selectedText: string) => {
	chrome.runtime.sendMessage({ action: 'select-popup', text: selectedText });
};

const TriggerButton = ({ selectedText }) => {
	return (
		<div
			title='Lookup'
			onClick={() => handleTrigger(selectedText)}
			className='p-1 bg-white shadow-xl shadow-purple-600 rounded-full cursor-pointer'
		>
			<img className='w-5 h-5' src={chrome.runtime.getURL('icon.png')} />
		</div>
	);
};

const handleUnmountRoot = () => {
	if (isMounted) {
		reactTriggerRoot.unmount();
		isMounted = false;
	}
};

let selectedText = '';

document.addEventListener('mouseup', (event) => {
	// handleUnmountRoot();

	if (window.getSelection().toString() == selectedText) return;

	selectedText = window.getSelection().toString();
	if (!selectedText.trim() || selectedText.split(' ').length > 2) return;

	const { clientX, clientY } = event;

	let rootPoint = document.getElementById(TRIGGER_ROOT_ID);

	if (!rootPoint) {
		rootPoint = document.createElement('div');
		rootPoint.id = TRIGGER_ROOT_ID;
		document.body.appendChild(rootPoint);
		rootPoint.style.position = 'fixed';
		reactTriggerRoot = ReactDOM.createRoot(rootPoint);
	}

	rootPoint.style.top = clientY - 40 + 'px';
	rootPoint.style.left = clientX + 'px';

	reactTriggerRoot.render(<TriggerButton selectedText={selectedText} />);
	isMounted = true;
});
