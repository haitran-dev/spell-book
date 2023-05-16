import React from 'react';
import { extractImages } from '../helpers/data-collect';
import range from '../utils/range';

const Images = ({ word }) => {
	const [images, setImages] = React.useState([]);
	const [isLoading, setLoading] = React.useState(false);

	React.useEffect(() => {
		setLoading(true);
		chrome.runtime.sendMessage({ action: 'fetch-images', text: word });

		const listenFetchImage = (request) => {
			if (request.action === 'response-images') {
				const { sourceImages, keyword } = request.data;

				console.log({ word, keyword });

				if (keyword !== word) return;

				const images = extractImages(sourceImages);
				setImages(images);
				setLoading(false);
			}
		};

		chrome.runtime.onMessage.addListener(listenFetchImage);
	}, []);

	return (
		<div className='columns-2 gap-2 overflow-auto p-2 -mr-2 rounded-lg shadow-md'>
			{isLoading ? (
				<>
					{range(1, 6).map((num) => (
						<div
							key={num}
							style={{ height: 150 + num * 10 + 'px' }}
							className='mb-2 rounded bg-slate-200 animate-pulse'
						/>
					))}
				</>
			) : (
				<>
					{images.map((image) => {
						return <Image key={image.idx} src={image.source} />;
					})}
				</>
			)}
		</div>
	);
};

const Image = ({ src }) => {
	return <img className='rounded w-full mb-2' src={src} />;
};

export default Images;
