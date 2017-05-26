import { StyleSheet } from 'aphrodite'

const styles = StyleSheet.create({
  container: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
  },
  errorPane: {
    height: 25,
    fontWeight: 600,
    fontSize: 14,
    backgroundColor: '#d64242',
    paddingTop: 6,
    paddingLeft: 10,
    color: '#fff',
  },
  successPane: {
    height: 25,
    fontWeight: 600,
    fontSize: 14,
    backgroundColor: '#299a33',
    paddingTop: 6,
    paddingLeft: 10,
    color: '#fff',
  },
  innerContainer: {
    height: 250,
    background: '#282c34',
    overflowY: 'scroll',
  },
  pretty: {
    color: '#abb2bf',
    padding: 5,
    margin: 3,
    height: '100%',
    border: 'none',
    width: '100%',
  },
})

export default styles
