import React from 'react'
import {connect} from 'cerebral/react'
import ProjectSelectorTag from '../ProjectSelectorTag'
import {displayTaskDuration} from '../../helpers/task'
import runningTask from '../../computed/runningTask'
import translations from '../../computed/translations'

export default connect(
  {
    task: runningTask,
    t: translations
  },
  {
    onChange: 'tasks.runningInputChanged',
    enterPressed: 'tasks.enterPressed',
    onClick: 'tasks.startStopClicked'
  },
  function Timer ({task, t, onChange, enterPressed, onClick}) {
    const onKeyPress = e => {
      switch (e.key) {
        case 'Enter': enterPressed(); break
        default: break // noop
      }
    }

    return (
      <nav className='level'>
        <div className='level-left'>
          <div className='level-item'>
            <p className='control has-addons'>
              <input className='input' type='text' style={{width: 230}}
                value={task.description || ''}
                onChange={(e) => onChange({description: e.target.value})}
                onKeyPress={onKeyPress}
                placeholder={t.WhatAreYouDoing} />
              <button className='button' onClick={() => onClick()}>
                {task.startedAt ? 'Stop' : 'Start'}
              </button>
            </p>
          </div>
          <div className='level-item'>
            <ProjectSelectorTag projectRef={task.projectRef} />
          </div>
        </div>
        <div className='level-right'>
          <div className='level-item'>
            <h3 className='title is-4'>
              {displayTaskDuration(task)}
            </h3>
          </div>
        </div>
      </nav>
    )
  }
)
