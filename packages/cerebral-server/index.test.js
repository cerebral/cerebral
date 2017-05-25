import http from 'http';
import html5Websocket from 'html5-websocket';
import { RunSignal } from 'cerebral/test';
import CerebralServer from '.';
import Client from './client';
import Devtools from 'cerebral/devtools';

describe('cerebral-server', () => {
  let cerebralServer;
  let runSignal;
  let answer;

  beforeEach(done => {
    answer = '';
    // setup the server
    cerebralServer = CerebralServer({
      signals: {
        getServerFoo: [
          function getServerFoo({ props, foo, returnToClient }) {
            if (props.clientId && props.correlationId) {
              returnToClient(props.clientId, props.correlationId, { foo });
            } else {
              answer = props.say === 'please' ? foo : "you dind't say please";
            }
          }
        ],
        getFooFromClient: [
          function getFooFromClient({ props, getClientSignal, foo }) {
            return getClientSignal(props.clientId, 'getClientFoo')({ say: 'please' }).then(({ foo }) => {
              answer = foo;
            });
          }
        ]
      },
      providers: [
        context => {
          context.foo = 'server bar';
          return context;
        }
      ],
      devtools: process.env.NODE_ENV === 'production' ? null : Devtools({ remoteDebugger: 'localhost:8585' })
    });
    const server = http.createServer();
    cerebralServer.bind({ server, perMessageDeflate: false });

    server.listen(() => {
      // setup the client
      runSignal = RunSignal({
        signals: {
          getClientFoo: [
            ({ props, foo, returnToServer }) => {
              if (props.correlationId) {
                returnToServer(props.correlationId, { foo });
              } else {
                answer = props.say === 'please' ? foo : "you dind't say please";
              }
            }
          ],
          getFooFromServer: [
            ({ getServerSignal }) => {
              return getServerSignal('getServerFoo')({ say: 'please' }).then(({ foo }) => {
                answer = foo;
              });
            }
          ]
        },
        providers: [
          context => {
            context.foo = 'client bar';
            context.WebSocket = html5Websocket; // just for testing
            return context;
          }
        ],
        modules: {
          server: Client({ timeout: 1000, endpoint: `ws://127.0.0.1:${server.address().port}` })
        }
      });
      runSignal('server.connect', { clientId: 'testUser' }).catch(done);
    });

    // wait until the test client has connected
    cerebralServer.once('connect', () => done());
  });

  it('can call server signals from the server', () => {
    const signal = cerebralServer.getSignal('getServerFoo');
    return signal()
      .then(() => expect(answer).toBe("you dind't say please"))
      .then(() => signal({ say: 'please' }))
      .then(() => expect(answer).toBe('server bar'));
  });

  it('can call client signals from the server', () => {
    const signal = cerebralServer.getSignal('getFooFromClient');
    return signal({ clientId: 'testUser' }).then(() => expect(answer).toBe('client bar'));
  });

  it('can call server signals from the client', () => {
    return runSignal('getFooFromServer').then(() => expect(answer).toBe('server bar'));
  });
});
