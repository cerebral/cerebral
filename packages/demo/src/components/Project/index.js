import React from 'react'
import {connect} from 'cerebral/react'

import ProjectCard from './card'
import ProjectForm from './form'

/** Note: we use a separate 'card' component so that we do
* not compute the 'projectWithDetails' computed when the project
* is new (isSelected but not saved to collection).
*/

export default connect(
  ({itemKey}) => ({
    // FIXME: should be removed. Temporary to force update.
    foo: `projects.$draft.key`
  }),
  function Project ({itemKey, isSelected}) {
    if (isSelected) {
      return <ProjectForm itemKey={itemKey} />
    } else {
      return <ProjectCard itemKey={itemKey} />
    }
  }
)
