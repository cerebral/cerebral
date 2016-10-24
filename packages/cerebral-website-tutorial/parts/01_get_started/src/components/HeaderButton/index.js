import React from 'react'
import { connect } from 'cerebral/react'

export default function HeaderButton(props) {
  return (
    <div>
      <button className="c-button c-button--info c-button--block">
        Some static content
      </button>
    </div>
  )
}