module.exports = tree => {
  tree.match({ tag: 'a', attrs: { href: /^\..*\.en\.md$/ } }, node => {
    node.attrs.href = node.attrs.href.replace(/\.en\.md$/, '.html')
    return node
  })
}
