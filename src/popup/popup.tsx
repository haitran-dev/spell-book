import React from 'react';
import ReactDOM from 'react-dom/client';
import '../assets/tailwind.css';

const app = <h1>hello</h1>;

const container = document.createElement('div');
document.body.appendChild(container);
const root = ReactDOM.createRoot(container);

root.render(app);
