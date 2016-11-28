import React from 'react'
import {connect} from 'cerebral/react'
import {displayElapsed, displayTime} from '../../helpers/dateTime'
import tasksByDay from '../../computed/tasksByDay'
import Date from '../Date'
import RunningElapsed from './RunningElapsed'

export default connect(
  {
    projects: 'projects.all.**',
    tasksByDay
  },
  function Tasks ({projects, tasksByDay}) {
    return (
      <div className='section'>
        {tasksByDay.map(day => (
          <table key={day.dayDate} className='table' style={{width: '100%'}}>
            <thead>
              <tr>
                <th colSpan='3'>
                  <Date date={day.date} />
                </th>
                <th style={{width: 100}}>{displayElapsed(day.totalElapsed)}</th>
              </tr>
            </thead>
            <tbody>
              {day.tasks.map(task =>
                <tr key={task.key}>
                  <td style={{width: 60}}>{displayTime(task.startedAt)}</td>
                  <td>{task.name}</td>
                  <td style={{width: 160}}><a href='#'>{projects[task.projectKey].name}</a></td>
                  <td>{typeof task.elapsed === 'number'
                        ? displayElapsed(task.elapsed)
                        : <RunningElapsed startedAt={task.startedAt} />
                       }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        ))}
      </div>
    )
  }
)
