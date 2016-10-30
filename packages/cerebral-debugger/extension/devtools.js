// Can use
// chrome.devtools.*
// chrome.extension.*

// Create a tab in the devtools area
var hasListener = false;
chrome.devtools.panels.create("Cerebral2", "toast.png", "build/index.html", function(panel) {});
