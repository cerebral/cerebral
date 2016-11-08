import React from 'react'
import { connect } from 'cerebral/react'
import HeaderButton from '../HeaderButton'
import Toast from '../Toast'
import Input from '../Input'
import LoadDataInput from '../LoadDataInput'
import StarCountButton from '../StarCountButton'
export default connect({
  appTitle: 'appTitle',
  activeTab: 'activeTab'
}, {
  stateAndActions: 'stateAndActionsRouted',
  gitHub: 'gitHubRouted'
}, function App (props) {
  return (
    <div className='o-container o-container--medium'>
      <h1 className='u-high'>{props.appTitle}</h1>
      <div className='c-tabs'>
        <div className='c-tabs__headings'>
          <div onClick={(event) => props.stateAndActions()} className={'c-tab-heading c-tab-heading' + (props.activeTab === 'StateAndActions' ? '--active' : '')}>
            State & Actions
          </div>
          <div onClick={(event) => props.gitHub()} className={'c-tab-heading c-tab-heading' + (props.activeTab === 'Github' ? '--active' : '')}>
            Github API
          </div>
        </div>
        <br />
        <div className={'c-tabs__tab' + (props.activeTab === 'StateAndActions' ? '--active' : '')}>
          <HeaderButton />
          <br />
          <Input />
        </div>
        <div className={'c-tabs__tab' + (props.activeTab === 'Github' ? '--active' : '')}>
          <LoadDataInput />
          <br />
          <StarCountButton />
        </div>
      </div>
      <Toast />
    </div>
  )
}
)
