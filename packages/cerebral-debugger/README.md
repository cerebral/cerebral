# cerebral-debugger-prototype
Prototype for the new debugger

## The goal
We want to build a new debugger with ideas from @delaneyj, as seen in this mockup:

![mockup.jpg](mockup.jpg)

There will be revisions to this mock, but you get the idea of the vision.

## How to start
`npm start -- --v2`

### Sending fake data
The debugger will receive a simulated INIT message when it fires up. To send more fake data use the console to:

`CONNECTOR.receiveEvent('v2/someMockData')`

Or with timed events:
`CONNECTOR.receiveEvents('v2/someMockData')`

The mocked data is put into the folder `connector\mocks\v2\someMockData`. Look at existing examples for more help.

### Data used by debugger
The debugger receives the raw signals from the client application. These signals are then converted to a data structure that
makes it easier to create lists etc. The raw signals are at path `['debugger', 'currentApp', 'signals']` and the converted
signals are at `['debugger', 'signals']`. The debugger signals just has a path reference to the actual signals inside the *currentApp.
