import React from 'react'
import {observer} from 'mobx-react'
import run from '../../run'
import './styles.css'

import newAssignmentTitleChanged from '../../events/newAssignmentTitleChanged'
import newAssignmentAssigneeChanged from '../../events/newAssignmentAssigneeChanged'
import newAssigmentAssigneAdded from '../../events/newAssigmentAssigneAdded'
import addAssignmentClicked from '../../events/addAssignmentClicked'

class AddAssignment extends React.Component {
  render () {
    const {
      newAssignmentTitle,
      newAssigmentAssignees,
      isSearching,
      assigneeSearchResult,
      newAssignmentAssignee,
      isPostingAssignment
    } = this.props.store.view

    return (
      <div className='AddAssignment'>
        <div>
          <input
            autoFocus
            className='AddAssignment__title'
            placeholder='New assignment...'
            value={newAssignmentTitle}
            onChange={(event) => run('newAssignmentTitleChanged', newAssignmentTitleChanged, {value: event.target.value})}
          />
        </div>
        <div className='AddAssignment__searchWrapper'>
          {newAssigmentAssignees.map((assignee, index) => (
            <div key={index} className='AddAssignment__assignee'>
              {assignee.name}
            </div>
          ))}
          <div className='AddAssignment__searchWrapper'>
            {
              isSearching
                ? <div className='AddAssignment__searchResult'>Searching...</div>
                : null
            }
            {
              !isSearching && assigneeSearchResult
                ? <div className='AddAssignment__searchResult'>{assigneeSearchResult.name}</div>
                : null
            }
            <input
              className='AddAssignment__newAssignee'
              placeholder='Add assignee...'
              value={newAssignmentAssignee}
              onKeyDown={(event) => event.keyCode === 13 && run('newAssigmentAssigneAdded', newAssigmentAssigneAdded)}
              onChange={(event) => run('newAssignmentAssigneeChanged', newAssignmentAssigneeChanged, {value: event.target.value})}
            />
          </div>
          <div>
            <button
              className='AddAssignment__button'
              disabled={(
                !newAssignmentTitle ||
                newAssigmentAssignees.length === 0 ||
                isPostingAssignment
              )}
              onClick={() => run('addAssignmentClicked', addAssignmentClicked)}
            >
              add
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default observer(AddAssignment)
