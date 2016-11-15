import {input, set, state, when} from 'cerebral/operators'
import getUser from '../../user/actions/getUser'

const getCurrentUser = [
  when(state`user.$loggedIn`), {
    true: [],
    false: [
      getUser, {
        success: [
          set(state`user.$loggedIn`, true),
          set(state`user.currentUser`, input`user`)
        ],
        error: [
          set(state`user.$loggedIn`, false)
        ]
      }
    ]
  }
]

export default getCurrentUser
