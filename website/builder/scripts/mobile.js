(function () {
  window.addEventListener('click', function (event) {
    document.querySelector('.docs-navigation-float.mobile').style.display = 'none'
  })
  document.querySelector('.docs-navigation-float.mobile').addEventListener('click', function (event) {
    event.stopPropagation()
  })
  document.querySelector('#hamburger').addEventListener('click', function (event) {
    event.stopPropagation()
    document.querySelector('.docs-navigation-float.mobile').style.display = 'block'
  })
  window.onhashchange = function () {
    document.querySelector('.docs-navigation-float.mobile').style.display = 'none'
  }
})()
