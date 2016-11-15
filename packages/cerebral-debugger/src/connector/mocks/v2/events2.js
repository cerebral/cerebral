module.exports = [{
  type: 'executionStart',
  datetime: 0,
  data: {
    'execution': {
      'name': 'signalWoop1',
      'executionId': 5,
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
      'datetime': 13503150913508
    }
  }
}, {
  type: 'execution',
  datetime: 1000,
  data: {
    execution: {
      'name': 'signalWoop12',
      'executionId': 5,
      'functionIndex': 0,
      'payload': {'foo': 'bip bap'},
      'datetime': 13503150914508,
      'data': null
    }
  }
}, {
  type: 'executionPathStart',
  datetime: 2000,
  data: {
    'execution': {
      'executionId': 5,
      'functionIndex': 0,
      'path': 'success'
    }
  }
}, {
  type: 'execution',
  datetime: 3000,
  data: {
    execution: {
      'executionId': 5,
      'functionIndex': 1,
      'payload': {'foo': 'bip bap'},
      'datetime': 13503150914508,
      'data': {
        type: 'mutation',
        method: 'set',
        args: [['foo', 'bar'], 'bar2']
      }
    }
  }
}, {
  type: 'executionPathStart',
  datetime: 4000,
  data: {
    execution: {
      'executionId': 5,
      'functionIndex': 1,
      'path': 'error'
    }
  }
}, {
  type: 'executionEnd',
  datetime: 5000,
  data: {
    execution: {
      'executionId': 5
    }
  }
}]
