/* eslint-disable no-script-url */
import React from 'react'
import {connect} from 'cerebral/react'
import {signal, state} from 'cerebral/tags'
import translations from '../../common/computed/translations'

import LangSelector from '../LangSelector'

const TaglineRe = /^(.*)\[Cerebral](.*)$/

export default connect(
  {
    currentUser: state`user.$currentUser`,
    loading: state`app.$loading`,
    loggedIn: state`user.$loggedIn`,
    signOutClicked: signal`user.signOutClicked`,
    t: translations
  },
  function Demo ({currentUser, loading, loggedIn, signOutClicked, t}) {
    const match = TaglineRe.exec(t.SiteTagLine)
    const tagline = match
      ? <h2 className='subtitle'>{match[1]}<a href='http://cerebraljs.com'>Cerebral</a>{match[2]}</h2>
      : <h2 className='subtitle'>{t.SiteTagLine}</h2>
    return (
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
                {currentUser && (
                  <div className='nav-item'>
                    {currentUser.email || t.Anonymous}
                  </div>
                )}
                {currentUser && (
                  <div className='nav-item'>
                    <a href='#' onClick={() => signOutClicked()}>
                      {t.loginSignOut}
                    </a>
                  </div>
                )}
                <div className='nav-item'>
                  {loggedIn && <LangSelector />}
                </div>
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
    )
  }
)
