const path = require('path')
const extractMarkdownFiles = require('./extractMarkdownFiles')
const extractPages = require('./extractPages')
const render = require('./render')
const {writeFile, emptyDir, copyDir, extractRawText} = require('./utils')

function renderPages (pagesNotContainingDocs, pages) {
  return pagesNotContainingDocs.map(function (pageName) {
    const Page = pages[pageName]

    return render({pageName, Page})
      .then(function (view) {
        return {
          fileName: pageName,
          content: view
        }
      })
  })
}

function renderDocs (docs, pages) {
  return Object.keys(docs).reduce(function (allDocs, sectionName) {
    return allDocs.concat(Object.keys(docs[sectionName]).map(function (docName) {
      const Page = pages.docs

      return render({
        pageName: 'docs',
        Page,
        docs,
        sectionName,
        docName
      })
        .then(function (view) {
          return {
            fileName: `docs/${sectionName}/${docName}`,
            content: view
          }
        })
    }))
  }, [])
}

Promise.all([
  extractMarkdownFiles(),
  extractPages()
])
  .then(function (results) {
    const docs = results[0]
    const pages = results[1]

    const pagesNotContainingDocs = Object.keys(pages).filter(function (page) {
      return page !== 'docs'
    })

    Promise.all([
      ...renderPages(pagesNotContainingDocs, pages),
      ...renderDocs(docs, pages)
    ])
      .then(function (renders) {
        return emptyDir('dist')
          .then(function () {
            return emptyDir('dist/docs')
              .then(function () {
                return Promise.all(Object.keys(docs).map(function (sectionDir) {
                  return emptyDir(`dist/docs/${sectionDir}`)
                }))
              })
          })
          .then(function noop () {})
          .then(function () {
            return renders.map(function (render) {
              return writeFile(path.join('dist', `${render.fileName}.html`), render.content)
            })
          })
      })
      .then(function () {
        return writeFile('dist/docs-text.js', JSON.stringify(extractRawText(docs)))
      })
      .then(function () {
        return Promise.all([
          copyDir('css', 'dist'),
          copyDir('scripts', 'dist'),
          copyDir('public', 'dist')
        ])
      })
      .then(function () {
        console.log('Build is finished!')
      })
      .catch(function (error) {
        console.error(error)
      })
  })
