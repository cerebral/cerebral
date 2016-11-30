/* eslint-disable no-script-url */
import React from 'react'
import {connect} from 'cerebral/react'
import translations from '../../common/computed/translations'

import Login from '../Login'
import Menu from '../Menu'
import Timer from '../Timer'
import Workspace from '../Workspace'
import Header from '../Header'

export default connect(
  {
    t: translations,
    loggedIn: 'user.$loggedIn',
    loading: 'app.$loading',
    currentUser: 'user.$currentUser'
  },
  {
    signOutClicked: 'user.signOutClicked'
  },
  function Demo ({t, loggedIn, loading, currentUser, signOutClicked}) {
    if (loading) {
      return null
    }
    if (!loggedIn) {
      return (
        <div className='App'>
          <Header />
          <Login />
        </div>
      )
    }
    return (
      <div className='App'>
        <Header />
        <section className='section'>
          <div className='container'>
            <div className='columns'>
              <Menu />
              <div className='column'>
                <Timer />
                <Workspace />
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }
)
