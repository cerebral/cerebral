module.exports = tree => {
  tree.match({ tag: 'a', attrs: { href: /.*youtube.com\/watch\?v=.*/ } }, node => {
    return {
      block: 'youtube',
      href: node.attrs.href
    }
  })
}
