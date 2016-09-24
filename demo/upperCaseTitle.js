import {Computed} from 'cerebral'

export default Computed({
  title: 'title'
}, props => {
  return (props.title || '').toUpperCase()
})
