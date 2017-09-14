document.querySelector('#nav').addEventListener('click', event => {
  const node = event.target

  if (
    node.tagName === 'A' &&
    node.href.indexOf('#') >= 0 &&
    node.parentNode.parentNode.childNodes[0].tagName === 'INPUT'
  ) {
    node.parentNode.parentNode.childNodes[0].click()
  }
})
