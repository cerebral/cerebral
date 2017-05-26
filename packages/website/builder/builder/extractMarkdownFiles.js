const React = require('react')
const path = require('path')
const marksy = require('marksy').marksy
const { readFile, fileExistsSync } = require('./utils')
const config = require('../config.json')

const compile = marksy({
  components: {
    Youtube(props) {
      return (
        <div style={{ textAlign: 'center' }}>
          <iframe
            style={{ border: '1px solid #333' }}
            width="560"
            height="315"
            src={props.url}
            frameborder="0"
            allowfullscreen
          />
        </div>
      )
    },
    Logo() {
      return (
        <div
          style={{
            background: 'url(/images/cerebral.png)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            width: '100%',
            height: '50vh',
          }}
        />
      )
    },
  },
  a(props) {
    return (
      <a
        href={props.href}
        target={props.href.substr(0, 4) === 'http' ? 'new' : null}
      >
        {props.children}
      </a>
    )
  },
})

module.exports = function() {
  const sections = Object.keys(config.docs)

  return Promise.all(
    sections.map(function(section) {
      return Promise.all(
        config.docs[section].map(function(file) {
          return readFile(
            typeof file === 'string' ? `${file}.md` : `${file.path}.md`
          )
        })
      )
    })
  )
    .then(function(fileContents) {
      return sections.reduce(function(contentTree, dir, index) {
        contentTree[dir] = config.docs[dir].reduce(function(
          subContent,
          contentName,
          subIndex
        ) {
          const name = contentName.name || path.basename(contentName)
          const key = subIndex === 0 ? 'index' : name
          const content = (fileContents[index][subIndex].match(
            /\[.*?]\(.*?\)/g
          ) || [])
            .map(markdownLink => {
              return markdownLink.match(/\((.*)\)/).pop()
            })
            .filter(filePath => {
              try {
                return fileExistsSync(path.resolve('docs', dir, filePath))
              } catch (e) {
                return false
              }
            })
            .reduce((currentContent, filePath) => {
              return currentContent.replace(
                `(${filePath})`,
                `(${path.dirname(filePath) + '/' + path.basename(filePath, '.md')}.html)`
              )
            }, fileContents[index][subIndex])

          subContent[key] = compile(content)
          subContent[key].raw = content
          subContent[
            key
          ].githubUrl = `https://github.com/cerebral/cerebral/tree/master/${(contentName.path ||
            contentName)
            .replace('../../', '')}.md`

          return subContent
        }, {})

        return contentTree
      }, {})
    })
    .catch(function(error) {
      console.log('Unable to extract markdown')
      console.error(error)
    })
}
