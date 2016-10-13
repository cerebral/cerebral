import React from 'react'
import styles from './styles.css'
import {connect} from 'react-redux'

function Assignments (props) {
  if (props.isLoading) {
    return (
      <div className={styles.wrapper}>
        <h3>Loading assignments...</h3>
      </div>
    )
  }
  return (
    <div className={styles.wrapper}>
      {props.assignments.map((assignment, index) => (
        <div key={index} className={styles.assignment}>
          <div className={styles.assignmentTitle}>{assignment.title}</div>
          <div className={styles.assignmentAssignees}>
            {assignment.assignedTo.map((userId, index) => {
              const user = props.users[userId]
              return (
                <div
                  key={index}
                  className={user ? styles.assignmentAssignee : styles.assignmentAssigneeLoading}
                >
                  {user ? user.name : 'Loading...'}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

export default connect(state => ({
  isLoading: state.isLoadingAssignments,
  assignments: state.assignments,
  users: state.users
}))(Assignments)
