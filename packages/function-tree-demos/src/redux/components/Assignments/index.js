import React from 'react'
import {connect} from 'react-redux'
import './styles.css'

function Assignments (props) {
  if (props.isLoading) {
    return (
      <div className='Assignments'>
        <h3>Loading assignments...</h3>
      </div>
    )
  }
  return (
    <div className='Assignments'>
      {props.assignments.map((assignment, index) => (
        <div key={index} className='Assignments__assignment'>
          <div className='Assignments__title'>{assignment.title}</div>
          <div className='Assignments__assignees'>
            {assignment.assignedTo.map((userId, index) => {
              const user = props.users[userId]
              return (
                <div
                  key={index}
                  className={user ? 'Assignments__assignee' : 'Assignments__assigneeLoading'}
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
