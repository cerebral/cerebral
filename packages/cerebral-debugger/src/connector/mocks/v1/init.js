module.exports = {
  'type': 'init',
  'app': '1234',
  'data': {
    'initialModel': {
      'foo': null
    },
    'executions': [{
      'name': 'signalWoop1',
      'executionId': 5,
      'functionIndex': 0,
      'staticTree': [{
        name: 'funcA',
        functionIndex: 0,
        outputs: {
          success: [{
            name: 'funcB',
            functionIndex: 1,
            outputs: {
              success: [{
                name: 'funcD',
                functionIndex: 3
              }],
              error: []
            }
          }],
          error: [{
            name: 'funcC',
            functionIndex: 2
          }]
        }
      }],
      'payload': {'foo': 'bip bap'},
      'datetime': 13503150913508,
      'data': null
    }, {
      'name': 'signalWoop12',
      'executionId': 5,
      'functionIndex': 1,
      'payload': {'foo': 'bip bap'},
      'datetime': 13503150914508,
      'data': {
        type: 'mutation',
        method: 'set',
        args: [['foo'], 'bar2']
      }
    }, {
      'name': 'signalWoop2',
      'executionId': 6,
      'functionIndex': 0,
      'staticTree': [{
        name: 'funcA',
        functionIndex: 0,
        outputs: {
          success: [{
            name: 'funcB',
            functionIndex: 1,
            outputs: {
              success: [{
                name: 'funcD',
                functionIndex: 3
              }],
              error: []
            }
          }],
          error: [{
            name: 'funcC',
            functionIndex: 2
          }]
        }
      }],
      'payload': {'foo': 'bip bap'},
      'datetime': 13503150915508,
      'data': null
    }, {
      'name': 'signalWoop2',
      'executionId': 6,
      'functionIndex': 1,
      'payload': {'foo': 'bip bap'},
      'datetime': 13503150915508,
      'data': {
        type: 'mutation',
        method: 'set',
        args: [['foo'], 'bar3']
      }
    }]
  }
}
