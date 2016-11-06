import { Computed } from 'cerebral'

export const getStars = Computed({
  cerebralStars: 'cerebralStarsCount',
  cerebralDebuggerStars: 'cerebralDebuggerStarsCount'
}, ({cerebralStars, cerebralDebuggerStars}) => {
  return cerebralStars + cerebralDebuggerStars
})
