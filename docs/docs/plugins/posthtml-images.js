module.exports = tree => {
  tree.match({ tag: 'img', attrs: { src: /^\.*\// } }, node => {
    node.attrs.src = './' + node.attrs.src.replace('../public/', '')
    return node
  })
}
