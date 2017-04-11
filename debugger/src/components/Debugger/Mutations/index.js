import './styles.css'
import Inferno from 'inferno' // eslint-disable-line
import {connect} from 'cerebral/inferno'
import {state, signal} from 'cerebral/tags'
import classnames from 'classnames'
import {nameToColors} from '../../../common/utils'
import Mutation from '../Signals/Signal/Action/Mutation'
import connector from 'connector'

export default connect({
  mutations: state`debugger.mutations`,
  currentRememberedMutationIndex: state`debugger.currentRememberedMutationIndex`,
  searchValue: state`debugger.searchValue`,
  isExecuting: state`debugger.isExecuting`,
  mutationDoubleClicked: signal`debugger.mutationDoubleClicked`,
  mutationClicked: signal`debugger.mutationClicked`,
  signalClicked: signal`debugger.signalClicked`
},
  function Mutations ({
    mutations,
    currentRememberedMutationIndex,
    searchValue,
    isExecuting,
    mutationDoubleClicked,
    mutationClicked,
    signalClicked
  }) {
    return (
      <div className='mutations'>
        <div className='list'>
          {mutations.map((mutation, index) => {
            const namePath = mutation.signalName.split('.')
            const name = namePath.pop()
            const colors = nameToColors(mutation.signalName, name)
            const hex = colors.backgroundColor
            const signalStyle = {
              backgroundColor: hex
            }
            const isSearchHit = searchValue && mutation.data.args[0].join('.').indexOf(searchValue) >= 0

            return (
              <li
                onDblClick={() => {
                  if (isExecuting) {
                    return
                  }

                  mutationDoubleClicked({index})
                  connector.sendEvent('remember', index)
                }}
                className={classnames('list-item', {
                  'faded': searchValue && !isSearchHit
                })}
                key={index}
              >
                {currentRememberedMutationIndex === index ? <div className='list-remembered' /> : null}
                <div className='list-indicator' style={signalStyle} />
                <div
                  className='signal-name'
                  onClick={() => signalClicked({executionId: mutation.executionId})}
                >
                  {mutation.signalName}
                </div>
                <Mutation mutation={mutation.data} onMutationClick={(path) => mutationClicked({path})} />
              </li>
            )
          })}
        </div>
      </div>
    )
  }
)
