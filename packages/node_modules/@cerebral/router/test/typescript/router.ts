import Router from '../..'

Router({
  routes: [{ path: '/', signal: 'foo' }],
  query: true,
  onlyHash: true,
})
