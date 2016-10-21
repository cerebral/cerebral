import startMobx from './mobx'
import startRedux from './redux'

const start = {
  redux: startRedux,
  mobx: startMobx
}

const demo = process.env.REACT_APP_DEMO || 'redux'
;(start[demo] || function () { document.write('unsupported demo: ' + demo) })()
