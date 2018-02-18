if (location.pathname === '/docs/contribute/issues.html') {
  const container = document.querySelector('.docs-doc-content')
  const loader = document.createElement('div')

  loader.innerHTML = 'Loading issues...'
  container.appendChild(loader)

  const getColorByBgColor = function(bgColor) {
    return parseInt(bgColor, 16) > 0xffffff / 2 ? '#000' : '#fff'
  }

  const renderIssues = function(issues) {
    const list = document.createElement('ul')
    list.className = 'issues'
    issues.forEach(function(issue) {
      const item = document.createElement('li')
      const title = document.createElement('div')
      const dateText = document.createElement('div')
      const titleLink = document.createElement('a')
      titleLink.href = issue.html_url
      titleLink.target = '_new'
      dateText.innerHTML =
        '<small>' + new Date(issue.created_at).toLocaleDateString() + '</small>'
      titleLink.innerHTML = issue.title
      item.appendChild(dateText)
      issue.labels.forEach(function(label) {
        if (label.name === 'PR needed') {
          return
        }
        const labelContainer = document.createElement('span')
        labelContainer.className = 'issues-label'
        labelContainer.innerHTML = label.name
        labelContainer.style.backgroundColor = '#' + label.color
        labelContainer.style.color = getColorByBgColor(label.color)
        item.appendChild(labelContainer)
      })
      title.appendChild(titleLink)
      item.appendChild(title)
      list.appendChild(item)
    })
    container.removeChild(loader)
    container.appendChild(list)
  }

  fetch(
    'https://api.github.com/repos/cerebral/cerebral/issues?state=open&labels=PR%20needed'
  )
    .then(function(response) {
      return response.json()
    })
    .then(function(issues) {
      return issues.sort(function(issueA, issueB) {
        return issueA.created_at > issueB.created_at
      })
    })
    .then(renderIssues)
}
