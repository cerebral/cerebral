/* eslint-env mocha */
import {Controller} from 'cerebral'
import {string, input} from 'cerebral/operators'
import HttpProvider, {httpGet, httpPost, httpPut, httpPatch, httpDelete} from './'
import assert from 'assert'
import mock from 'xhr-mock'

mock.setup()

describe('Http Provider', () => {
  it('should create requests', (done) => {
    mock.get('/items', (req, res) => {
      return res
        .status(200)
        .header('Content-Type', 'application/json')
        .body(JSON.stringify({foo: 'bar'}))
    })
    const controller = Controller({
      providers: [HttpProvider()],
      signals: {
        test: [
          ({http, path}) => {
            return http.request({method: 'GET', url: '/items'})
              .then(path.success)
          }, {
            success: [
              ({input}) => {
                assert.deepEqual(input, {result: {foo: 'bar'}, status: 200})
                done()
              }
            ]
          }
        ]
      }
    })
    controller.getSignal('test')()
  })
  it('should create GET requests with queries', (done) => {
    mock.get('/items?foo=bar', (req, res) => {
      assert.equal(req.url(), '/items?foo=bar')
      return res
        .status(200)
        .header('Content-Type', 'application/json')
    })
    const controller = Controller({
      providers: [HttpProvider()],
      signals: {
        test: [
          ({http, path}) => {
            return http.get('/items', {foo: 'bar'})
              .then(path.success)
          }, {
            success: [() => done()]
          }
        ]
      }
    })
    controller.getSignal('test')()
  })
  it('should create POST requests with body', (done) => {
    mock.post('/items', (req, res) => {
      assert.equal(req.body(), JSON.stringify({foo: 'bar'}))
      return res
        .status(200)
        .header('Content-Type', 'application/json')
    })
    const controller = Controller({
      providers: [HttpProvider()],
      signals: {
        test: [
          ({http, path}) => {
            return http.post('/items', {foo: 'bar'})
              .then(path.success)
          }, {
            success: [() => done()]
          }
        ]
      }
    })
    controller.getSignal('test')()
  })
  it('should create PUT requests with body', (done) => {
    mock.put('/items', (req, res) => {
      assert.equal(req.body(), JSON.stringify({foo: 'bar'}))
      return res
        .status(200)
        .header('Content-Type', 'application/json')
    })
    const controller = Controller({
      providers: [HttpProvider()],
      signals: {
        test: [
          ({http, path}) => {
            return http.put('/items', {foo: 'bar'})
              .then(path.success)
          }, {
            success: [() => done()]
          }
        ]
      }
    })
    controller.getSignal('test')()
  })
  it('should create PATCH requests with body', (done) => {
    mock.patch('/items', (req, res) => {
      assert.equal(req.body(), JSON.stringify({foo: 'bar'}))
      return res
        .status(200)
        .header('Content-Type', 'application/json')
    })
    const controller = Controller({
      providers: [HttpProvider()],
      signals: {
        test: [
          ({http, path}) => {
            return http.patch('/items', {foo: 'bar'})
              .then(path.success)
          }, {
            success: [() => done()]
          }
        ]
      }
    })
    controller.getSignal('test')()
  })
  it('should create DELETE requests', (done) => {
    mock.delete('/items', (req, res) => {
      assert.ok(true)
      return res
        .status(200)
        .header('Content-Type', 'application/json')
    })
    const controller = Controller({
      providers: [HttpProvider()],
      signals: {
        test: [
          ({http, path}) => {
            return http.delete('/items')
              .then(path.success)
          }, {
            success: [() => done()]
          }
        ]
      }
    })
    controller.getSignal('test')()
  })
  it('should abort request', (done) => {
    mock.get('/items', (req, res) => {
      return res.timeout(500)
    })
    const controller = Controller({
      providers: [HttpProvider()],
      signals: {
        test: [
          ({http, path}) => {
            return http.get('/items')
              .catch((response) => {
                assert.ok(response.isAborted)
                return path.aborted()
              })
          }, {
            aborted: [() => done()]
          }
        ],
        test2: [({http}) => {
          http.abort('/items')
        }]
      }
    })
    controller.getSignal('test')()
    controller.getSignal('test2')()
  })
  it('should expose factories to do requests', (done) => {
    mock.get('/items/1', (req, res) => {
      return res.status(200).header('Content-Type', 'application/json')
    })
    mock.post('/items/1', (req, res) => {
      return res.status(200).header('Content-Type', 'application/json')
    })
    mock.put('/items/1', (req, res) => {
      return res.status(200).header('Content-Type', 'application/json')
    })
    mock.patch('/items/1', (req, res) => {
      return res.status(200).header('Content-Type', 'application/json')
    })
    mock.delete('/items/1', (req, res) => {
      return res.status(200).header('Content-Type', 'application/json')
    })

    let responseCount = 0
    const controller = Controller({
      providers: [HttpProvider()],
      signals: {
        test: [
          httpGet(string`/items/${input`itemId`}`), {
            success: [() => { responseCount++ }]
          },
          httpPost(string`/items/${input`itemId`}`), {
            success: [() => { responseCount++ }]
          },
          httpPut(string`/items/${input`itemId`}`), {
            success: [() => { responseCount++ }]
          },
          httpPatch(string`/items/${input`itemId`}`), {
            success: [() => { responseCount++ }]
          },
          httpDelete(string`/items/${input`itemId`}`), {
            success: [() => { responseCount++ }]
          },
          () => {
            assert.equal(responseCount, 5)
            done()
          }
        ]
      }
    })
    controller.getSignal('test')({
      itemId: 1
    })
  })
})
