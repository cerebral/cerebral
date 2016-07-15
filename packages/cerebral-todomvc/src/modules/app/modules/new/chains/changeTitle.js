import copy from 'cerebral/operators/copy'

export default [
  copy('input:title', 'state:app.new.title')
]
