import {StyleSheet} from 'aphrodite'

const styles = StyleSheet.create({
  container: {
    color: '#999',
    fontWeight: 400,
    paddingLeft: 40,
    display: 'inline-block'
  },
  innerContainer: {
    lineHeight: '47px',
    cursor: 'pointer',
    display: 'inline-block',
    ':hover': {
      borderBottom: '3px solid #499',
      color: '#000'
    }
  },
  selected: {
    borderBottom: '3px solid #499'
  }
})

export default styles
