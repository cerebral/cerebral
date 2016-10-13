import React from 'react'
import styles from './styles.css'
import {observer} from 'mobx-react'

@observer
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
        <div className={styles.wrapper}>
          <h3>Loading assignments...</h3>
        </div>
      )
    }
    return (
      <div className={styles.wrapper}>
        {assignments.map((assignment, index) => (
          <div key={index} className={styles.assignment}>
            <div className={styles.assignmentTitle}>{assignment.title}</div>
            <div className={styles.assignmentAssignees}>
              {assignment.assignedTo.map((userId, index) => {
                const user = users.has(userId) && users.get(userId)

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
}

export default Assignments
