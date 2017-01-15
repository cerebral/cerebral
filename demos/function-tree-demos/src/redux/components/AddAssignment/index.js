import React from 'react'
import {connect} from 'react-redux'
import run from '../../run'
import './styles.css'

import newAssignmentTitleChanged from '../../events/newAssignmentTitleChanged'
import newAssignmentAssigneeChanged from '../../events/newAssignmentAssigneeChanged'
import newAssigmentAssigneAdded from '../../events/newAssigmentAssigneAdded'
import addAssignmentClicked from '../../events/addAssignmentClicked'

function AddAssignment (props) {
  return (
    <div className='AddAssignment'>
      <div>
        <input
          autoFocus
          className='AddAssignment__title'
          placeholder='New assignment...'
          value={props.assignmentTitle}
          onChange={(event) => run('newAssignmentTitleChanged', newAssignmentTitleChanged, {value: event.target.value})}
        />
      </div>
      <div className='AddAssignment__searchWrapper'>
        {props.assignees.map((assignee, index) => (
          <div key={index} className='AddAssignment__assignee'>
            {assignee.name}
          </div>
        ))}
        <div className='AddAssignment__searchWrapper'>
          {
            props.isSearching
              ? <div className='AddAssignment__searchResult'>Searching...`</div>
              : null
          }
          {
            !props.isSearching && props.assignee
              ? <div className='AddAssignment__searchResult'>{props.assignee.name}</div>
              : null
          }
          <input
            className='AddAssignment__newAssignee'
            placeholder='Add assignee...'
            value={props.assignmentAssignee}
            onKeyDown={(event) => event.keyCode === 13 && run('newAssigmentAssigneAdded', newAssigmentAssigneAdded)}
            onChange={(event) => run('newAssignmentAssigneeChanged', newAssignmentAssigneeChanged, {value: event.target.value})}
          />
        </div>
        <div>
          <button
            className='AddAssignment__button'
            disabled={(
              !props.assignmentTitle ||
              props.assignees.length === 0 ||
              props.isPostingAssignment
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

export default connect(state => ({
  assignmentTitle: state.newAssignmentTitle,
  assignmentAssignee: state.newAssignmentAssignee,
  assignee: state.assigneeSearchResult,
  isSearching: state.isSearching,
  assignees: state.newAssigmentAssignees,
  isPostingAssignment: state.isPostingAssignment
}))(AddAssignment)
