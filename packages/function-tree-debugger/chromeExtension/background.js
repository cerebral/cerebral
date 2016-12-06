/* global chrome */
chrome.extension.onConnect.addListener(function (port) {
  var extensionListener = function (message, sender, sendResponse) {
    if (message.tabId && message.content) {
                // Evaluate script in inspectedPage
      if (message.action === 'code') {
        chrome.tabs.executeScript(message.tabId, {code: message.content})

                // Attach script to inspectedPage
      } else if (message.action === 'script') {
        chrome.tabs.executeScript(message.tabId, {file: message.content})

                // Pass message to inspectedPage
      } else {
        chrome.tabs.sendMessage(message.tabId, message, sendResponse)
      }

        // This accepts messages from the inspectedPage and
        // sends them to the panel
    } else {
      port.postMessage(message)
    }
    sendResponse(message)
  }

    // Listens to messages sent from the panel
  chrome.extension.onMessage.addListener(extensionListener)

  port.onDisconnect.addListener(function (port) {
    chrome.extension.onMessage.removeListener(extensionListener)
  })
})
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  return true
})
