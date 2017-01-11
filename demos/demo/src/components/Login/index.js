import React from 'react'
import {connect} from 'cerebral/react'
import {signal, state} from 'cerebral/tags'
import translations from '../../common/computed/translations'
import LangSelector from '../LangSelector'
import SignIn from './SignIn'
import CreateUser from './CreateUser'

export default connect(
  {
    t: translations,
    tab: state`user.$loginTab`,
    tabClick: signal`user.loginTabClicked`
  },
  function Login ({t, tab, tabClick}) {
    return (
      <div>
        <div className='Login modal is-active'>
          <div className='modal-background' />
          <div className='modal-content'>
            <div style={{position: 'relative', overflow: 'visible'}}>
              <div style={{position: 'absolute', top: -30, right: 12, zIndex: 2000}}>
                <LangSelector />
              </div>
            </div>
            <div className='box'>
              <div className='tabs'>
                <ul>
                  <li className={`${tab === 'SignIn' ? 'is-active' : ''}`}>
                    <a onClick={() => tabClick({value: 'SignIn'})}>{t.loginSignIn}</a>
                  </li>
                  <li className={`${tab === 'CreateUser' ? 'is-active' : ''}`}>
                    <a onClick={() => tabClick({value: 'CreateUser'})}>{t.loginCreateUser}</a>
                  </li>
                </ul>
              </div>
              {tab === 'SignIn'
               ? <SignIn />
               : <CreateUser />
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
)
