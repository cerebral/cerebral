import React from 'react'
import {connect} from 'cerebral/react'
import visibleProjectKeys from '../../computed/visibleProjectKeys'
import translations from '../../computed/translations'

import Project from '../Project'

export default connect(
  {
    filter: 'projects.$filter',
    projectKeys: visibleProjectKeys,
    selectedKey: 'projects.$draft.key',
    t: translations
  },
  {
    enterPressed: 'projects.filterEnterPressed',
    onChange: 'projects.filterChanged',
    onClick: 'projects.addClicked'
  },
  function Projects ({filter, projectKeys, selectedKey, t, enterPressed, onChange, onClick}) {
    const onKeyPress = e => {
      switch (e.key) {
        case 'Enter': enterPressed(); break
        default: break // noop
      }
    }

    return (
      <div>
        <div className='level'>
          <div className='level-left'>
            <div className='level-item'>
              <p className='control has-addons'>
                <input className='input'
                  placeholder={t.ProjectNameFilter}
                  value={filter || ''}
                  onChange={e => onChange({value: e.target.value})}
                  onKeyPress={onKeyPress}
                  />
                <button className='button is-primary'
                  onClick={() => onClick()}>
                  {t.Add}
                </button>
              </p>
            </div>
          </div>
        </div>
        <div className='columns is-multiline'>
          {projectKeys.map(key => (
            <div key={key} className='column'>
              <Project itemKey={key} isSelected={key === selectedKey}/>
            </div>
          ))}
        </div>
      </div>
    )
  }
)
