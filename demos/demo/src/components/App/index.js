/* eslint-disable no-script-url */
import React from 'react'
import {connect} from 'cerebral/react'
import {signal, state} from 'cerebral/tags'
import translations from '../../common/computed/translations'

import Login from '../Login'
import Menu from '../Menu'
import Notification from '../Notification'
import Timer from '../Timer'
import Workspace from '../Workspace'
import Header from '../Header'

export default connect(
  {
    currentUser: state`user.$currentUser`,
    loading: state`app.$loading`,
    loggedIn: state`user.$loggedIn`,
    signOutClicked: signal`user.signOutClicked`,
    t: translations
  },
  function Demo ({currentUser, loading, loggedIn, signOutClicked, t}) {
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
          <Notification />
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
