import React from 'react';
import ReactDOM from 'react-dom/client';
import '../assets/tailwind.css';

const Popup = () => (
	<div className='p-2 flex gap-2 min-w-[100px]'>
		<img className='w-10' src='icon.png' alt='' />
		<p className='font-semibold'>Spell Book</p>
	</div>
);

const container = document.createElement('div');
container.id = 'popup-root';
document.body.appendChild(container);
const root = ReactDOM.createRoot(container);

root.render(<Popup />);
