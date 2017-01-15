import React from 'react'
import {connect} from 'cerebral/react'
import {signal} from 'cerebral/tags'
import ProjectSelectorTag from '../ProjectSelectorTag'
import {displayTaskDuration, isRunning} from '../../modules/tasks/helpers'
import runningTask from '../../computed/runningTask'
import translations from '../../common/computed/translations'

export default connect(
  {
    enterPressed: signal`tasks.enterPressed`,
    item: runningTask,
    onChange: signal`tasks.formValueChanged`,
    onClick: signal`tasks.startStopClicked`,
    t: translations
  },
  function Timer ({enterPressed, item, onChange, onClick, t}) {
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
                value={item.name || ''}
                onChange={(e) => onChange({key: 'name', value: e.target.value})}
                onKeyPress={onKeyPress}
                placeholder={t.WhatAreYouDoing} />
              <button className='button' onClick={() => onClick()}>
                {isRunning(item) ? 'Stop' : 'Start'}
              </button>
            </p>
          </div>
          <div className='level-item'>
            <ProjectSelectorTag itemKey={item.projectKey || 'no-project'} />
          </div>
        </div>
        <div className='level-right'>
          <div className='level-item'>
            <h3 className='title is-4'>
              {displayTaskDuration(item)}
            </h3>
          </div>
        </div>
      </nav>
    )
  }
)
