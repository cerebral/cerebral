import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'

import ClientCard from './card'
import ClientForm from './form'

/** Note: we use a separate 'card' component so that we do
* not compute the 'ClientWithDetails' computed when the Client
* is new (isSelected but not saved to collection).
*/

export default connect(
  {
    // FIXME: should be removed. Temporary to force update.
    foo: state`clients.$draft.key`
  },
  function Client ({isSelected, itemKey}) {
    if (isSelected) {
      return <ClientForm itemKey={itemKey} />
    } else {
      return <ClientCard itemKey={itemKey} />
    }
  }
)
