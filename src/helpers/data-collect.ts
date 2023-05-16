import { CAMBRIDGE_DOMAIN } from '../constant';

export const extractData = (sourceContent: string, word: string) => {
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

export const extractImages = (sourceImages: string) => {
	const dom = new DOMParser().parseFromString(sourceImages, 'text/html');
	console.log({ dom });
	if (!dom) return null;

	const images = [];

	const imageLiElements = dom.querySelectorAll('[data-idx]');

	imageLiElements.forEach((ele: HTMLImageElement) => {
		const dataId = +ele.getAttribute('data-idx');

		const source = ele.querySelector('[data-src]')?.getAttribute('data-src');

		if (source) {
			images.push({ idx: dataId, source });
		}
	});

	return images;
};
