;(function() {
  let text
  let isLoadingText = false
  let searchTimeout = null

  function search(value) {
    const results = Object.keys(text).reduce(function(
      sectionResults,
      sectionKey
    ) {
      return sectionResults.concat(
        Object.keys(text[sectionKey]).reduce(function(
          subSectionResults,
          subSectionKey
        ) {
          const regexp = new RegExp(value, 'g')
          const matches = []
          let match = null
          while (
            (match = regexp.exec(text[sectionKey][subSectionKey].raw)) != null
          ) {
            matches.push(match)
          }

          if (matches.length) {
            return subSectionResults.concat({
              section: sectionKey,
              subSection: subSectionKey,
              title: text[sectionKey][subSectionKey].title,
              matches: matches.length,
            })
          }

          return subSectionResults
        }, [])
      )
    }, [])

    results.sort(function(resultA, resultB) {
      if (resultA.matches > resultB.matches) {
        return -1
      } else if (resultA.matches < resultB.matches) {
        return 1
      }

      return 0
    })

    const searchResult = document.querySelector('#search-result')
    const fiveFirst = results.splice(0, 5)
    searchResult.innerHTML = ''
    if (fiveFirst.length) {
      fiveFirst.forEach(function(result) {
        const resultEl = document.createElement('a')

        resultEl.className = 'docs-search-result-item'
        resultEl.innerHTML = `<span>${result.section}</span> - ${result.title}`
        resultEl.href = `/docs/${result.section}/${result.subSection}.html`
        searchResult.appendChild(resultEl)
      })
    } else {
      const resultEl = document.createElement('a')

      resultEl.className = 'docs-search-result-item'
      resultEl.innerHTML = `<span>No result</span>`
      resultEl.href = ''
      searchResult.appendChild(resultEl)
    }

    searchResult.style.display = 'block'
  }

  function setSearchLoadTimeout(value) {
    clearTimeout(searchTimeout)
    setTimeout(function() {
      if (text) {
        search(value)
      } else {
        setSearchLoadTimeout(value)
      }
    }, 100)
  }

  document.body.addEventListener('click', function() {
    document.querySelector('#search-result').style.display = 'none'
  })

  document
    .querySelector('#search-docs')
    .addEventListener('keyup', function(event) {
      if (event.target.value.length < 3) {
        document.querySelector('#search-result').style.display = 'none'

        return
      }

      if (isLoadingText) {
        return setSearchLoadTimeout(event.target.value)
      }

      if (text) {
        search(event.target.value)
      } else {
        isLoadingText = true

        const oReq = new window.XMLHttpRequest()
        oReq.addEventListener('load', function() {
          text = JSON.parse(this.responseText)
          search(event.target.value)
        })
        oReq.open('GET', '/docs-text.js')
        oReq.send()
      }
    })
})()
