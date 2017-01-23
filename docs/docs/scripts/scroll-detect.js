(function () {
  let isAtTop = document.body.scrollTop === 0

  document.addEventListener('scroll', function () {
    if (document.body.scrollTop === 0) {
      document.querySelector('#navigation').style.boxShadow = 'none'
      isAtTop = true
    } else if (isAtTop) {
      isAtTop = false
      document.querySelector('#navigation').style.boxShadow = '0px 5px 10px rgba(0,0,0,0.05)'
    }
  })

  if (!isAtTop) {
    document.querySelector('#navigation').style.boxShadow = '0px 5px 10px rgba(0,0,0,0.05)'
  }
})()
