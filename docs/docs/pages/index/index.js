import React from 'react'

function Index (props) {
  return (
    <div className='index-container'>
      <div className='index-top'>
        <div className='logo' />
        <div className='index-subtitle'>cerebral</div>
        <div className='index-motto'>make sense of complex apps</div>
      </div>
      <div className='index-bottom'>
        <a className='button' href='/todomvc'>demo</a>
        <a className='button' href='/docs/install_cerebral.html'>install</a>
        <a className='button' href='/docs/api_controller.html'>api</a>
      </div>
    </div>
  )
}

export default Index
