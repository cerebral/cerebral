module.exports = tree => {
  tree.match({ content: [{ tag: 'a', content: ['Next'] }] }, node => {
    return {
      block: 'next',
      url: node.content[0].attrs.href
    }
  })
}
