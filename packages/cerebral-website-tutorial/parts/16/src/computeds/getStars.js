import { Computed } from 'cerebral'

export const getStars = Computed({
  cerebralStars: 'github.cerebralStarsCount',
  cerebralDebuggerStars: 'github.cerebralDebuggerStarsCount'
}, ({cerebralStars, cerebralDebuggerStars}) => {
  return cerebralStars + cerebralDebuggerStars
})
