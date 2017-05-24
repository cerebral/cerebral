import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'

import ProjectCard from './card'
import ProjectForm from './form'

/** Note: we use a separate 'card' component so that we do
* not compute the 'projectWithDetails' computed when the project
* is new (isSelected but not saved to collection).
*/

export default connect(
  {
    // FIXME: should be removed. Temporary to force update.
    foo: state`projects.$draft.key`
  },
  function Project ({isSelected, itemKey}) {
    if (isSelected) {
      return <ProjectForm itemKey={itemKey} />
    } else {
      return <ProjectCard itemKey={itemKey} />
    }
  }
)
