import React from 'react'

export default function Input({
  fieldType,
  icon,
  message,
  placeholder,
  showError,
  value,
  onChange,
  onEnter,
}) {
  const onKeyPress = e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onEnter(e)
    }
  }
  return (
    <p className="control has-icon">
      <input
        className="input"
        type={fieldType}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
      />
      {showError && <i className="fa fa-warning" />}
      {showError &&
        <span className="help is-danger">
          {message}
        </span>}
      {!showError && <i className={icon} />}
    </p>
  )
}
