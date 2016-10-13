import React from 'react'
import styles from './styles.css'
import {connect} from 'react-redux'
import run from '../../run'

import newAssignmentTitleChanged from '../../events/newAssignmentTitleChanged'
import newAssignmentAssigneeChanged from '../../events/newAssignmentAssigneeChanged'
import newAssigmentAssigneAdded from '../../events/newAssigmentAssigneAdded'
import addAssignmentClicked from '../../events/addAssignmentClicked'

function AddAssignment (props) {
  return (
    <div className={styles.wrapper}>
      <div>
        <input
          autoFocus
          className={styles.assignmentTitle}
          placeholder='New assignment...'
          value={props.assignmentTitle}
          onChange={(event) => run('newAssignmentTitleChanged', newAssignmentTitleChanged, {value: event.target.value})}
        />
      </div>
      <div className={styles.assigneeSearchWrapper}>
        {props.assignees.map((assignee, index) => (
          <div key={index} className={styles.assignmentAssignee}>
            {assignee.name}
          </div>
        ))}
        <div className={styles.assigneeSearchWrapper}>
          {
            props.isSearching
              ? <div className={styles.assigneeSearchResult}>Searching...`</div>
              : null
          }
          {
            !props.isSearching && props.assignee
              ? <div className={styles.assigneeSearchResult}>{props.assignee.name}</div>
              : null
          }
          <input
            className={styles.assignmentNewAssignee}
            placeholder='Add assignee...'
            value={props.assignmentAssignee}
            onKeyDown={(event) => event.keyCode === 13 && run('newAssigmentAssigneAdded', newAssigmentAssigneAdded)}
            onChange={(event) => run('newAssignmentAssigneeChanged', newAssignmentAssigneeChanged, {value: event.target.value})}
          />
        </div>
        <div>
          <button
            className={styles.add}
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
