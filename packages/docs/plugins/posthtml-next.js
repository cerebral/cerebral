module.exports = tree => {
  tree.match({ content: [{ tag: 'a', content: ['Next'] }] }, node => {
    if (!(node.content[0] && node.content[0].attrs && node.content[0].attrs.href)) {
      console.warn('failed to parse a link to next page')
      return node
    }

    return {
      block: 'next',
      url: node.content[0].attrs.href
    }
  })
}
