/* global chrome */
// TODO: create panel only when there is compatible cerebral with devtools enabled on current page
chrome.devtools.panels.create('Cerebral2', 'toast.png', 'build/index.html', function (panel) {})
