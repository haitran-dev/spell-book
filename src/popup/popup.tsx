import React from 'react';
import ReactDOM from 'react-dom/client';
import '../assets/tailwind.css';

const Popup = () => {
	const [value, setValue] = React.useState('');

	const searchKeyword = (word: string) => {
		chrome.runtime.sendMessage({ action: 'select-popup', text: word });
	};

	React.useEffect(() => {
		const handleKeydown = (e) => {
			if (e.keyCode === 13) {
				searchKeyword(value);
			}
		};

		document.addEventListener('keydown', handleKeydown);
		return () => document.removeEventListener('keydown', handleKeydown);
	}, [value]);

	return (
		<div className='p-2 min-w-[100px]'>
			<p className='mb-1'>Search what you need</p>
			<div className='flex items-center h-6 gap-1'>
				<input
					autoFocus
					className='block h-full border border-solid border-black rounded p-1'
					placeholder='Typing here'
					value={value}
					onChange={(e) => setValue(e.target.value)}
				/>
				<button
					className='bg-blue-500 rounded hover:bg-blue-700 text-white h-full px-2'
					onClick={() => searchKeyword(value)}
				>
					Search
				</button>
			</div>
		</div>
	);
};

const container = document.createElement('div');
container.id = 'popup-root';
document.body.appendChild(container);
const root = ReactDOM.createRoot(container);

root.render(<Popup />);
