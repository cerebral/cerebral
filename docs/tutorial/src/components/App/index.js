import React from 'react'
import {connect} from 'cerebral/react'
import {state, signal} from 'cerebral/tags'
import Toast from '../Toast'
import starsCount from '../../computeds/starsCount'

export default connect({
  title: state`app.title`,
  subTitle: state`app.subTitle`,
  repos: state`repos.list`,
  activeTab: state`app.activeTab`,
  starsCount,
  homeRouted: signal`home.routed`,
  reposRouted: signal`repos.routed`
},
  function App (props) {
    return (
      <div className='o-container o-container--medium'>
        <h1>{props.title}</h1>
        <h3>{props.subTitle}</h3>
        <div className='c-tabs'>
          <div className='c-tabs__headings'>
            <div
              onClick={(event) => props.homeRouted()}
              className={`c-tab-heading ${props.activeTab === 'home' ? 'c-tab-heading--active' : ''}`}
            >
              Home
            </div>
            <div
              onClick={(event) => props.reposRouted()}
              className={`c-tab-heading ${props.activeTab === 'repos' ? 'c-tab-heading--active' : ''}`}
            >
              Repos
            </div>
          </div>
          <br />
          <div className={'c-tabs__tab' + (props.activeTab === 'home' ? 'c-tabs__tab--active' : '')}>
            <h5>Current start count</h5>
            <h1>{props.starsCount}</h1>
          </div>
          <div className={'c-tabs__tab' + (props.activeTab === 'repos' ? 'c-tabs__tab--active' : '')}>
            <ul>
              {Object.keys(props.repos).map((repoKey, index) => (
                <li key={index}>
                  {props.repos[repoKey].name} ({props.repos[repoKey].stargazers_count})
                </li>
              ))}
            </ul>
          </div>
        </div>
        <Toast />
      </div>
    )
  }
)
