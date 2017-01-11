import React from 'react'
import {connect} from 'cerebral/react'
import {state} from 'cerebral/tags'
import translations from '../../common/computed/translations'

const MENUS = [
  {
    name: 'Work',
    entries: [
      {name: 'Today', icon: 'fa-clock-o', url: '#/'},
      {name: 'Report', icon: 'fa-bar-chart', url: '#/report'}
    ]
  },
  {
    name: 'Manage',
    entries: [
      {name: 'Clients', icon: 'fa-users', url: '#/clients'},
      {name: 'Projects', icon: 'fa-folder', url: '#/projects'},
      {name: 'Tasks', icon: 'fa-tasks', url: '#/tasks'}
    ]
  }
]

export default connect({
  selectedView: state`app.$selectedView`,
  t: translations
},
  function Navbar ({selectedView, t}) {
    return (
      <div className='column is-2'>
        <aside className='menu'>
          {MENUS.map(menu => (
            <div key={menu.name}>
              <p className='menu-label'>{t[menu.name]}</p>
              <ul className='menu-list'>
                {menu.entries.map(entry => (
                  <li key={entry.name}>
                    <a className={`${selectedView === entry.name ? 'is-active' : ''}`}
                      href={`${entry.url}`}>
                      <span className='icon is-small'>
                        <i className={`fa ${entry.icon}`} />
                      </span>
                      &nbsp;{t[entry.name]}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>
      </div>
    )
  }
)
