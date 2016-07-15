import copy from 'cerebral/operators/copy'
import or from 'cerebral-addons/or'
import literal from 'cerebral-addons/literal'

export default [
  copy(or('input:filter', literal('all')), 'state:app.footer.filter')
]
