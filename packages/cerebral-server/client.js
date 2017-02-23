import ReconnectingWebSocket from 'reconnecting-websocket';
import uuid from 'uuid/v1';

export default function cerebralServerModuleFactory(options = {}) {
  return function cerebralServerModule({ controller, path }) {
    let ws;
    let clientId;
    let timeout = options.timeout || 30 * 1000;

    return {
      signals: {
        connect: [
          ({ props, WebSocket = ReconnectingWebSocket }) => {
            clientId = props.clientId || uuid();
            return new Promise((resolve, reject) => {
              if (ws) {
                return reject(new Error('WebSocket is already open'));
              }

              try {
                const url = document.location;
                ws = new WebSocket(options.endpoint || `${url.protocol === 'https:' ? 'wss' : 'ws'}://${url.hostname}`);
              } catch (e) {
                console.error('failed create websocket', e);
                reject(e);
              }

              ws.addEventListener('open', () => {
                ws.send(JSON.stringify({ clientId }));
                resolve();
              });

              ws.addEventListener('message', event => {
                const message = JSON.parse(event.data);
                if (!message.signal) {
                  return;
                }
                const signal = controller.getSignal(message.signal);
                if (!signal) {
                  return console.warn('signal not found: ', message.signal);
                }
                const props = message.props;
                props.correlationId = message.correlationId;
                signal(props);
              });
            });
          }
        ]
      },
      provider(context) {
        context.getServerSignal = signal => props => {
          return new Promise(function(resolve, reject) {
            const correlationId = uuid();
            const timeoutId = setTimeout(
              () => {
                reject(new Error('Timeout waiting for server to respond'));
              },
              timeout
            );
            const onResponse = function onResponse(event) {
              const response = JSON.parse(event.data);
              if (response.correlationId === correlationId) {
                clearTimeout(timeoutId);
                ws.removeEventListener('message', onResponse);
                resolve(response.props);
              }
            };
            ws.addEventListener('message', onResponse);
            ws.send(JSON.stringify({ clientId, props, signal, correlationId }));
          });
        };

        context.returnToServer = (correlationId, props) => {
          ws.send(JSON.stringify({ props, correlationId }));
        };

        return context;
      }
    };
  };
}
