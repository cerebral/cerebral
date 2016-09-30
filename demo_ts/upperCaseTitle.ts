import {Computed} from 'cerebral'

interface Props {
  title?: string
}

export default Computed<Props, string>({
  title: 'title'
}, props => {
  return (props.title || '').toUpperCase()
})
