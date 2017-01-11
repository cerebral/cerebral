import {
  ASSIGNMENTS_LOADING,
  ASSIGNMENTS_LOADED_SUCCESS,
  ASSIGNMENTS_LOADED_ERROR,
  USERS_LOADED_SUCCESS,
  USERS_LOADED_ERROR,
  NEW_ASSIGNMENT_TITLE_CHANGED,
  NEW_ASSIGNMENT_ASSIGNEE_CHANGED,
  ASSIGNEE_SEARCHED_SUCCESS,
  ASSIGNEE_SEARCHED_ERROR,
  ASSIGNEE_SEARCHING,
  ASSIGNEE_SEARCH_RESET,
  NEW_ASSIGNMENT_ASSIGNEE_ADDED,
  POSTING_ASSIGNMENT,
  POSTED_ASSIGNMENT_SUCCESS,
  POSTED_ASSIGNMENT_ERROR
} from './constants'

const initialState = {
  title: 'Assignments',
  isLoadingAssignments: false,
  assignments: [],
  assignmentsError: null,
  users: {},
  usersError: null,
  newAssignmentTitle: '',
  newAssignmentAssignee: '',
  assigneeSearchResult: null,
  assigneeSearchError: null,
  isSearching: false,
  newAssigmentAssignees: [],
  isPostingAssignment: false,
  postError: null
}

function AppReducer (state = initialState, action) {
  switch (action.type) {
    case ASSIGNMENTS_LOADING:
      return Object.assign({}, state, {
        isLoadingAssignments: true
      })
    case ASSIGNMENTS_LOADED_SUCCESS:
      return Object.assign({}, state, {
        assignments: action.payload.data,
        isLoadingAssignments: false
      })
    case ASSIGNMENTS_LOADED_ERROR:
      return Object.assign({}, state, {
        assignmentsError: action.payload.data,
        isLoadingAssignments: false
      })
    case USERS_LOADED_SUCCESS:
      const newUsers = action.payload.users.reduce((currentUsers, user) => {
        currentUsers[user.id] = user

        return currentUsers
      }, {})
      return Object.assign({}, state, {
        users: Object.assign({}, state.users, newUsers)
      })
    case USERS_LOADED_ERROR:
      return Object.assign({}, state, {
        usersError: action.payload.data
      })
    case NEW_ASSIGNMENT_TITLE_CHANGED:
      return Object.assign({}, state, {
        newAssignmentTitle: action.payload.value
      })
    case NEW_ASSIGNMENT_ASSIGNEE_CHANGED:
      return Object.assign({}, state, {
        newAssignmentAssignee: action.payload.value
      })
    case ASSIGNEE_SEARCHING:
      return Object.assign({}, state, {
        isSearching: true
      })
    case ASSIGNEE_SEARCHED_SUCCESS:
      return Object.assign({}, state, {
        assigneeSearchResult: action.payload.assignee,
        isSearching: false
      })
    case ASSIGNEE_SEARCHED_ERROR:
      return Object.assign({}, state, {
        assigneeSearchError: action.payload.error,
        isSearching: false
      })
    case ASSIGNEE_SEARCH_RESET:
      return Object.assign({}, state, {
        assigneeSearchResult: null
      })
    case NEW_ASSIGNMENT_ASSIGNEE_ADDED:
      return Object.assign({}, state, {
        newAssigmentAssignees: state.newAssigmentAssignees.concat(state.assigneeSearchResult),
        isSeaching: false,
        assigneeSearchResult: null,
        newAssignmentAssignee: ''
      })
    case POSTING_ASSIGNMENT:
      const newAssignment = {
        id: null,
        title: state.newAssignmentTitle,
        assignedTo: state.newAssigmentAssignees.map(user => user.id)
      }
      return Object.assign({}, state, {
        assignments: [newAssignment].concat(state.assignments),
        isPostingAssignment: true
      })
    case POSTED_ASSIGNMENT_SUCCESS:
      return Object.assign({}, state, {
        newAssignmentTitle: '',
        newAssigmentAssignees: [],
        assignments: state.assignments.map((assignment, index) => {
          if (index === 0) {
            return Object.assign({}, assignment, {
              id: action.payload.data.id
            })
          }

          return assignment
        }),
        isPostingAssignment: false
      })
    case POSTED_ASSIGNMENT_ERROR:
      return Object.assign({}, state, {
        assignments: state.assignments.filter((assignment, index) => index !== 0),
        isPostingAssignment: false,
        postError: action.data
      })
    default:
      return state
  }
}

export default AppReducer
