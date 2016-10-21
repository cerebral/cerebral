import React from 'react'
import {observer} from 'mobx-react'
import './styles.css'

class Assignments extends React.Component {
  render () {
    const {
      isLoadingAssignments
    } = this.props.store.view
    const {
      assignments,
      users
    } = this.props.store.data

    if (isLoadingAssignments) {
      return (
        <div className='Assignments'>
          <h3>Loading assignments...</h3>
        </div>
      )
    }
    return (
      <div className='Assignments'>
        {assignments.map((assignment, index) => (
          <div key={index} className='Assignments__assignment'>
            <div className='Assignments__title'>{assignment.title}</div>
            <div className='Assignments__assignees'>
              {assignment.assignedTo.map((userId, index) => {
                const user = users.has(userId) && users.get(userId)

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
}

export default observer(Assignments)
