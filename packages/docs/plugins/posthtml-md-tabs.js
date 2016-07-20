module.exports = tree => {
  var tabs = []
  tree.walk(node => {
    if (node.tag === 'h6') {
      tabs.push({ elem: 'tab', name: node.content, content: [] })
      node = null
    } else if (tabs.length && node.tag === 'hr') {
      node = { block: 'tabs', content: tabs }
      tabs = []
    } else if (tabs.length) {
      tabs[tabs.length - 1].content.push(node.content || node)
      node = null
    }

    return node
  })
}
