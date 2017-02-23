const FunctionTree = require('function-tree').default;
const DebuggerProvider = require('cerebral/lib/providers/Debugger').default;
const WebSocket = require('ws');
const uuid = require('uuid/v1');
const EventEmitter = require('events');

const propsProvider = context => {
  context.props = context.input;
  return context;
};

module.exports = function CerebralServer({ signals = {}, providers = [], devtools }) {
  const eventEmitter = new EventEmitter();
  const clients = {};
  let clientTimeout = 30 * 1000;

  const getSignalProviders = context => {
    context.getClientSignal = (clientId, signal) => {
      const ws = clients[clientId];
      if (!ws) {
        return null;
      }
      return props => new Promise((resolve, reject) => {
        const correlationId = uuid();
        const timeoutId = setTimeout(
          () => {
            reject(new Error('Timeout waiting for client to respond'));
          },
          clientTimeout
        );
        const onResponse = data => {
          const response = JSON.parse(data);
          if (response.correlationId === correlationId) {
            clearTimeout(timeoutId);
            ws.removeListener('message', onResponse);
            resolve(response.props);
          }
        };
        ws.on('message', onResponse);
        ws.send(JSON.stringify({ signal, props, correlationId }));
      });
    };

    context.returnToClient = (clientId, correlationId, props) => {
      const ws = clients[clientId];
      ws.send(JSON.stringify({ props, correlationId }));
    };
    return context;
  };

  const getSignal = eventEmitter.getSignal = function getSignal(signal) {
    const tree = signals[signal];
    if (!tree) {
      return null;
    }
    return props => new Promise((resolve, reject) => {
      const execute = FunctionTree([
        propsProvider,
        getSignalProviders,
        ...providers,
        ...(devtools
          ? [
              context => {
                context.controller = execute;
                return context;
              },
              DebuggerProvider()
            ]
          : [])
      ]);
      if (devtools) {
        global.WebSocket = require('html5-websocket');
        execute.devtools = devtools;
        execute.model = { get: () => ({}) };
        devtools.init(execute);
        execute.on('error', function throwErrorCallback(error) {
          if (Array.isArray(execute._events.error) && execute._events.error.length > 2) {
            execute.removeListener('error', throwErrorCallback);
          } else {
            throw error;
          }
        });
      }
      execute.on('end', resolve);
      execute.on('error', reject);
      execute(signal, tree, props);
    });
  };

  eventEmitter.bind = function bind(options) {
    clientTimeout = options.timeout || clientTimeout;
    const wss = new WebSocket.Server(options);

    wss.on('connection', function connection(ws) {
      let clientId;

      ws.on('message', function incoming(data) {
        const message = JSON.parse(data);
        if (!clientId && message.clientId) {
          clientId = message.clientId;
          clients[clientId] = ws;
          eventEmitter.emit('connect', { clientId });
        }
        if (!message.signal) {
          return;
        }
        const signal = getSignal(message.signal);
        if (!signal) {
          return console.warn('signal not found:', message.signal);
        }
        const props = message.props;
        props.clientId = clientId;
        props.correlationId = message.correlationId;
        signal(props);
      });

      ws.on('close', function() {
        delete clients[clientId];
        eventEmitter.emit('disconnect', { clientId });
      });
    });
  };

  return eventEmitter;
};
