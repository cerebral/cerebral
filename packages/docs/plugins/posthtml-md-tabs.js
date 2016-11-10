module.exports = tree => {
  var tabs = []
  tree.walk(node => {
    if (node.tag === 'h6') {
      tabs.push({ elem: 'tab', name: node.content, content: [] })
      node = undefined
    } else if (tabs.length && node.tag === 'hr') {
      node = { block: 'tabs', content: tabs }
      tabs = []
    } else if (tabs.length) {
      tree.match.call(node, { tag: 'img' }, img => {
        img.attrs['data-src'] = img.attrs.src
        delete img.attrs.src
        return img
      })
      tabs[tabs.length - 1].content.push(node.content || node)
      node = undefined
    }

    return node
  })
}
