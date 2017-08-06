function setLinkHighlight(forceLink) {
  const existingLink = document.querySelector('.nav_link_selected')
  if (existingLink) {
    existingLink.className = 'nav_link'
  }

  const id = typeof forceLink === 'string'
    ? location.pathname + forceLink
    : location.href.replace(location.origin, '')

  const link = document.querySelector('[href="' + id + '"]')

  if (link && link.parentNode.className.indexOf('nav_open') === -1) {
    link.parentNode.className += ' nav_link_selected'
  }
}

if (location.hash) {
  location.href = location.hash
}

setLinkHighlight()

window.addEventListener('popstate', setLinkHighlight)

const headings = document.querySelectorAll('h1, h2, h3, h4, h5')
const scrollPositions = Array.prototype.slice
  .call(headings)
  .filter(heading => Boolean(heading.id))
  .map(heading => {
    return {
      top: heading.getBoundingClientRect().top,
      id: heading.id,
      el: heading,
    }
  })

const doc = document.querySelector('.docs-doc')

let currentId = location.hash.substr(1)

function onScroll() {
  let newCurrentId
  for (let scrollPosition in scrollPositions) {
    if (scrollPositions[scrollPosition].top >= doc.scrollTop + 150) {
      break
    }
    newCurrentId = scrollPositions[scrollPosition].id
  }

  if (doc.scrollTop === 0) {
    newCurrentId = scrollPositions[0].id
  }

  if (doc.scrollTop + doc.offsetHeight === doc.scrollHeight) {
    newCurrentId = scrollPositions[scrollPositions.length - 1].id
  }

  if (newCurrentId && currentId !== newCurrentId) {
    currentId = newCurrentId
    setLinkHighlight('#' + currentId)
    window.removeEventListener('popstate', setLinkHighlight)
    doc.removeEventListener('wheel', onScroll)
    scrollPositions.forEach(heading => (heading.el.id = ''))
    location.hash = currentId
    scrollPositions.forEach(heading => (heading.el.id = heading.id))
    window.addEventListener('popstate', setLinkHighlight)
    doc.addEventListener('wheel', onScroll)
  }
}

doc.addEventListener('wheel', onScroll)
