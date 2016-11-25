import React from 'react'

export default function Input ({fieldType, placeholder, value, onChange, message, showError, icon}) {
  return (
    <p className='control has-icon'>
      <input className='input'
        type={fieldType}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e)}
      />
      {showError && (
        <i className='fa fa-warning' />
      )}
      {showError && (
        <span className='help is-danger'>
          {message}
        </span>
      )}
      {!showError && (
        <i className={icon} />
      )}
    </p>
  )
}
