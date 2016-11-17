import React from 'react'

export default function Input ({fieldType, placeholder, value, onChange, message, icon}) {
  return (
    <p className='control has-icon'>
      <input className='input'
        type={fieldType}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e)}
      />
      {message && (
        <i className='fa fa-warning' />
      )}
      {message && (
        <span className='help is-danger'>
          {message}
        </span>
      )}
      {!message && (
        <i className={icon} />
      )}
    </p>
  )
}
