import { showToast, getData } from '../app/actions'
import { state, set, input } from 'cerebral/operators'

export default {
  state: {repoName: 'cerebral',
    data: {},
    cerebralStarsCount: 0,
    cerebralDebuggerStarsCount: 0
  },
  signals: {getRepoInfoClicked: [
    set(state`github.repoName`, input`value`),
    ...showToast('Loading Data for repo: @{github.repoName}', 0),
    getData('/repos/cerebral/'),
    {
      success: [
        set(state`github.data`, input`result`),
        ...showToast('How cool is that. @{github.repoName} has @{github.data.subscribers_count} subscribers and @{github.data.stargazers_count} stars!', 0, 'success')
      ],
      error: [
        set(state`github.data`, input`result`),
        ...showToast('Ooops something went wrong: @{github.data.message}', 0, 'error')
      ]
    },
    ...showToast('Load Data finished...', 2000)
  ],
    starCountClicked: [
      ...showToast('Counting Stars...', 0),
      [
        ...showToast('Get Cerebral Stars...', 0),
        getData('/repos/cerebral/', 'cerebral'),
        {
          success: [
            set(state`github.cerebralStarsCount`, input`result.stargazers_count`)
          ],
          error: [
            set(state`github.data`, input`result`),
            ...showToast('Ooops something went wrong loading the StarCount for Cerebral: @{github.data.message}', 0, 'error')
          ]
        },
        ...showToast('Get Cerebral-Debugger Stars...', 0),
        getData('/repos/cerebral/', 'cerebral-debugger'),
        {
          success: [
            set(state`github.cerebralDebuggerStarsCount`, input`result.stargazers_count`)
          ],
          error: [
            set(state`github.data`, input`result`),
            ...showToast('Ooops something went wrong loading the StarCount for Cerebral-Debugger: @{github.data.message}', 0, 'error')
          ]
        }
      ],
      ...showToast(`Total Stars @C{getStars}`, 3000)
    ]
  },
  modules: {}
}
