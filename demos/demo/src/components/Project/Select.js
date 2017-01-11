import React from 'react'
import {connect} from 'cerebral/react'
import {props, signal, state} from 'cerebral/tags'
import translations from '../../common/computed/translations'

export default connect(
  {
    // autoFocus
    clients: state`clients.all.**`,
    // field
    // placeholderKey
    value: state`projects.$draft.${props`field`}`,
    valueChanged: signal`projects.formValueChanged`,
    t: translations
  },
  function Input ({autoFocus, clients, field, placeholder, value, valueChanged, t}) {
    const onChange = e => {
      valueChanged({key: field, value: e.target.value})
    }

    const clientsList = Object.keys(clients).map(ref => clients[ref]).sort((a, b) => a <= b ? -1 : 1)

    return (
      <select className='select'
        placeholder={t[placeholder]}
        onChange={onChange}
        value={value || ''}
        name={field}
        >
        {clientsList.map(c => (
          <option key={c.key} value={c.key}>
            {c.name}
          </option>
        ))}
      </select>
    )
  }
)
