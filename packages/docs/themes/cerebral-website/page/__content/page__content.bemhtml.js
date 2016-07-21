block('page').elem('content').match(function () {
  return this.mods.layout !== 'root'
})(
  content()(function () {
    var content = [ { block: 'page', elem: 'edit' } ].concat(this.ctx.content.filter(function (node, index) {
      return !(node && node.block === 'next')
    }))

    var next = this.ctx.content.filter(function (node, index) {
      return node && node.block === 'next'
    })

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
            content: content
          },
        ]
      },
      next && {
        block: 'row',
        mods: { sar: true },
        content: [
          { 
            elem: 'col',
            elemMods: { sw: 8 },
            content: next
          }
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
        tabs && tabs.push(node)
      } else {
        data && data.push(node)
      }
    })
    return content
  })
)
