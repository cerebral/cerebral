import React from 'react';
import styles from './styles.css';
import {observer} from 'mobx-react';
import run from '../../run';

import newAssignmentTitleChanged from '../../events/newAssignmentTitleChanged';
import newAssignmentAssigneeChanged from '../../events/newAssignmentAssigneeChanged';
import newAssigmentAssigneAdded from '../../events/newAssigmentAssigneAdded';
import addAssignmentClicked from '../../events/addAssignmentClicked';

@observer
class AddAssignment extends React.Component {
  render() {
    const {
      newAssignmentTitle,
      newAssigmentAssignees,
      isSearching,
      assigneeSearchResult,
      newAssignmentAssignee,
      isPostingAssignment
    } = this.props.store.view;

    return (
      <div className={styles.wrapper}>
        <div>
          <input
            autoFocus
            className={styles.assignmentTitle}
            placeholder="New assignment..."
            value={newAssignmentTitle}
            onChange={(event) => run('newAssignmentTitleChanged', newAssignmentTitleChanged, {value: event.target.value})}
          />
        </div>
        <div className={styles.assigneeSearchWrapper}>
          {newAssigmentAssignees.map((assignee, index) => (
            <div key={index} className={styles.assignmentAssignee}>
              {assignee.name}
            </div>
          ))}
          <div className={styles.assigneeSearchWrapper}>
            {
              isSearching ?
                <div className={styles.assigneeSearchResult}>
                  Searching...
                </div>
              :
                null
            }
            {
              !isSearching && assigneeSearchResult ?
                <div className={styles.assigneeSearchResult}>
                  {assigneeSearchResult.name}
                </div>
              :
                null
            }
            <input
              className={styles.assignmentNewAssignee}
              placeholder="Add assignee..."
              value={newAssignmentAssignee}
              onKeyDown={(event) => event.keyCode === 13 && run('newAssigmentAssigneAdded', newAssigmentAssigneAdded)}
              onChange={(event) => run('newAssignmentAssigneeChanged', newAssignmentAssigneeChanged, {value: event.target.value})}
            />
          </div>
          <div>
            <button
              className={styles.add}
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
    );
  }
}

export default AddAssignment;
