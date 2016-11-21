/* eslint-disable no-script-url */
import React from 'react'
import {connect} from 'cerebral/react'
import translations from '../../computed/translations'

import LangSelector from '../LangSelector'
import Login from '../Login'
import Menu from '../Menu'
import Timer from '../Timer'
import Workspace from '../Workspace'

const TaglineRe = /^(.*)\[Cerebral\](.*)$/

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
    const match = TaglineRe.exec(t.SiteTagLine)
    const tagline = match
      ? <h2 className='subtitle'>{match[1]}<a href='http://cerebraljs.com'>Cerebral</a>{match[2]}</h2>
      : <h2 className='subtitle'>{t.SiteTagLine}</h2>
    if (loading) {
      return null
    }
    if (!loggedIn) {
      return <Login />
    }
    return (
      <div className='App'>
        <section className='hero is-dark'>
          <div className='hero-head'>
            <div className='container'>
              <nav className='nav'>
                <div className='nav-left'>
                  <a className='nav-item is-brand'>
                    {/* Wait until we have a logo that scales well in this place
                      <img src='/cerebral-logo.png' alt='Cerebral logo' />
                      */}
                  </a>
                </div>
                <div className='nav-right'>
                  <div className='nav-item'>
                    <LangSelector />
                  </div>
                  {currentUser && (
                    <div className='nav-item'>
                      {currentUser.email}
                    </div>
                  )}
                  {currentUser && (
                    <div className='nav-item'>
                      <a href='#' onClick={() => signOutClicked()}>
                        {t.loginSignOutButton}
                      </a>
                    </div>
                  )}
                </div>
              </nav>
            </div>
          </div>
          <div className='hero-body'>
            <div className='container'>
              <h1 className='title'>{t.CerebralDemo}</h1>
              {tagline}
            </div>
          </div>
        </section>
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
