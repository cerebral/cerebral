import copyInputToView from '../factories/copyInputToView'
import setView from '../factories/setView'
import debounce from 'function-tree/lib/factories/debounce'
import hasInputValue from '../factories/hasInputValue'
import searchAssignee from '../functions/searchAssignee'

export default [
  copyInputToView('value', 'newAssignmentAssignee'),
  debounce(500, [
    hasInputValue('value'), {
      true: [
        setView('isSearching', true),
        searchAssignee, {
          success: [
            copyInputToView('assignee', 'assigneeSearchResult'),
            setView('isSearching', false)
          ],
          error: [
            setView('error', 'Could not search assignee')
          ]
        }
      ],
      false: [
        setView('assigneeSearchResult', null)
      ]
    }
  ])
]
