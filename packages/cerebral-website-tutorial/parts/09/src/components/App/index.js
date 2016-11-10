import React from 'react'
import {connect} from 'cerebral/react'
import starsSum from '../../computeds/starsSum'
import Toast from '../Toast'

export default connect({
  title: 'title',
  subTitle: 'subTitle',
  starsCount: starsSum
}, {
  buttonClicked: 'buttonClicked'
},
  function App (props) {
    return (
      <div className='o-container o-container--medium'>
        <h1>{props.title}</h1>
        <h3>{props.subTitle}</h3>
        <button
          className='c-button c-button--info c-button--block'
          onClick={() => props.buttonClicked()}
        >
          Update star count ({props.starsCount})
        </button>
        <Toast />
      </div>
    )
  }
)
