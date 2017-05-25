# Cerebral Server
Run cerebral signals on both client and nodejs server.

## Server Setup

From your nodejs app you need to create a CerebralServer and then bind it to any existing http server object.

```js
import http from 'http';
import CerebralServer from 'cerebral-server';
import Devtools from 'cerebral/devtools';

const cerebralServer = CerebralServer({
  signals: {
    saveUsersStuff: [saveUsersStuff],
    notifyUser: [notifyUser]
  },
  providers: [
    context => {
      context.mongo = mongo; // 🤦
      return context;
    }
  ],
  devtools: process.env.NODE_ENV === 'production' ? null : Devtools({ remoteDebugger: 'localhost:8585' })
});

const server = http.createServer();
cerebralServer.bind({ server });
server.listen(3000)
```

### Debugging

If you configure devtools for remote debuggingj in the same way as you do for a cerebral controller (as in the above example) then the siganls and actions will be displayed in the regular standalone cerebral debugger.

### Server Actions

Actions for CerebralServer are the same as on the client except that you do not have a access to `state` and you have two additional context methods `getClientSignal` and `returnToClient`. The `returnToClient` method should always be invoked once during a signal called by the client to allow the client action to continue.

```js
// saveUsersStuff
export default ({ props: { clientId, correlationId }, mongo, returnToClient }) => {
  // save client stuff in the db
  if (clientId && correlationId) {
    returnToClient(clientId, correlationId, { allGood: true });
  }
}

// notifyUser
export default ({ props: { clientId, message }, getClientSignal }) => {
  const signal = getClientSignal(clientId, 'notify');
  return signal({ message });
}
```

### Server Events

CerebralServer emits the following events:

```js
cerebralServer.on('connect', ({ clientId }) => {});
cerebralServer.on('disconnect', ({ clientId }) => {});
```

## Client Setup

```js
import { Controller } from 'cerebral';
import CerebralServerClient from 'cerebral-server/client';

const controller = Controller({
  signals: {
    notify: [notify],
    saveMyStuff: [saveMyStuff]
  },
  modules: {
    server: CerebralServerClient()
  }
}

// call the connect signal and provide a unique clientId
controller.getSignal('server.connect')({ clientId: 'someUserName' });
```

### Client Actions

The CerebralServerClient module adds two additional context methods `getServerSignal` and `returnToServer`. The `returnToServer` method should always be invoked once during a signal called by the server to allow the server action to continue.

```js
// notify
export default ({ props: { correlationId, message }, foo, returnToServer }) => {
  // notify the user here
  if (correlationId) {
    returnToServer(correlationId, {});
  }
}

// saveMyStuff
({ props, getServerSignal }) => {
  const signal = getServerSignal('saveUsersStuff');
  return signal(props);
}
```
