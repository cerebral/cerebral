var Prism = require('prismjs')
var entities = require("entities")

module.exports = tree => {
  tree.match({ tag: 'code' }, node => {
    if (node.attrs && node.attrs.class === 'lang-js') {
      node.content[0] = Prism.highlight(entities.decodeHTML(node.content[0]), Prism.languages.javascript)
    }
    return node
  })
}
