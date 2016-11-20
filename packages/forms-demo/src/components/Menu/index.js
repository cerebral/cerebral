import React from 'react'
import {css} from 'aphrodite'
import {connect} from 'cerebral/react'
import MenuItem from './MenuItem'
import SettingsCheckbox from './SettingsCheckbox'
import styles from './styles'

const types = [
  {name: 'Simple', url: '#/simple'}
]

export default connect(
  {
    settings: 'app.settings'
  },
  function Menu ({settings}) {
    return (
      <div className={css(styles.container)}>
        <div className={css(styles.innerContainer)}>
          {
            types.map((type, index) => {
              return (
                <MenuItem type={type} key={index} />
              )
            })
          }
        </div>
        <div className={css(styles.settingsContainer)}>
          {Object.keys(settings).map((settingKey, index) => {
            return <SettingsCheckbox key={index} path={`app.settings.${settingKey}`} />
          })}
        </div>
      </div>
    )
  }
)
