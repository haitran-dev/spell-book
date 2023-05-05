console.log('hello');

document.onmouseup = () => {
	const text = document.getSelection();
	console.log({ text });

	if (!text) return;

	document.getElementById('selected').textContent = text;
};
