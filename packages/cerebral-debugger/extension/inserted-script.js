// This is included and executed in the inspected page
(function (window) {
	var update = function (event) {
		if (!event.detail) {
			throw new Error('You have to pass a serializeable object to a signal. Did you pass a mouse event maybe?');
			return;
		}

		try {
			chrome.extension.sendMessage(event.detail);
		} catch (e) {
			console.log('FAILED', e);
			window.removeEventListener('cerebral2.client.message', update);
		}
	};
	window.addEventListener('cerebral2.client.message', update);

}(window));
