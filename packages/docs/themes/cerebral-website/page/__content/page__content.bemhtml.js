block('page').elem('content').match(function () {
  return this.mods.layout !== 'root'
})(
  content()(function () {
    return [
      {
        block: 'row',
        content: [
          { 
            elem: 'col',
            elemMods: { sw: 24, lw: 5 },
            content: { block: 'side-nav' }
          },
          {
            elem: 'col',
            elemMods: { sw: 24, lw: 18, lo: 1 },
            content: applyNext()
          },

        ]
      }
    ]
  })
)

block('page').elem('content').mod('layout', 'root')(
  content()(function() {
    var md = applyNext()
    var lastRowIndex = -1
    var even, data, tabs
    var content = []

    md.forEach(function (node) {
      if (node && node.tag === 'h2') {
        lastRowIndex++
        even = !!(lastRowIndex % 2)
        data = [node]
        tabs = []

        content.push({
          block: 'row',
          content: [
            {
              elem: 'col',
              elemMods: { sw: 24, lw: 11, lo: even && 2 },
              content: data
            }, {
              elem: 'col',
              elemMods: { sw: 24, lw: 11, lo: even || 2, lof: even, xlof: even, xxlof: even },
              content: tabs
            }
          ]
        })
      } else if (node && node.block === 'tabs') {
        tabs.push(node)
      } else {
        data.push(node)
      }
    })
    return content
  })
)
