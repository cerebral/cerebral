import React from 'react'
import {connect} from 'cerebral/react'
import translations from '../../common/computed/translations'

export default connect(
  ({field}) => ({
    clients: 'clients.all.**',
    value: `projects.$draft.${field}`,
    t: translations
  }),
  {
    valueChanged: 'projects.formValueChanged'
  },
  function Input ({clients, field, value, placeholder, autoFocus, enterPressed, escPressed, valueChanged, t}) {
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
