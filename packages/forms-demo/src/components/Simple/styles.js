import {StyleSheet} from 'aphrodite'

const styles = StyleSheet.create({
  button: {
    background: '#282c34',
    color: '#fff',
    fontSize: 13,
    border: '1px solid #000',
    fontWeight: 600,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 3,
    outline: 'none'
  },
  disabled: {
    opacity: 0.5
  },
  enabled: {
    ':hover': {
      background: '#000',
      cursor: 'pointer'
    }
  }
})

export default styles
