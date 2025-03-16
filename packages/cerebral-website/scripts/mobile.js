;(function () {
  window.addEventListener('click', function () {
    document.getElementById('nav').classList.remove('show')
  })
  document.getElementById('nav').addEventListener('click', function (event) {
    event.stopPropagation()
  })
  document
    .getElementById('hamburger')
    .addEventListener('click', function (event) {
      event.stopPropagation()
      document.getElementById('nav').classList.toggle('show')
    })
  window.onhashchange = function () {
    document.getElementById('nav').classList.remove('show')
  }
})()
