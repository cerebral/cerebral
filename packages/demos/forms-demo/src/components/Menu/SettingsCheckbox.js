import React from 'react'
import { connect } from 'cerebral/react'
import { state, props, signal } from 'cerebral/tags'

export default connect(
  {
    field: state`${props`path`}`,
    toggleSelectSettings: signal`app.toggleSelectSettings`,
  },
  function SettingsCheckbox({ field, path, toggleSelectSettings }) {
    const { value } = field
    return (
      <div style={{ float: 'left', paddingRight: 10, marginTop: 5 }}>
        <input
          type={'checkbox'}
          checked={value ? 'checked' : ''}
          onChange={e =>
            toggleSelectSettings({
              field: path,
              value: !value,
            })}
        /> {field.description}
      </div>
    )
  }
)
