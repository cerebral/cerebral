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
            elemMods: { sw: 24, lw: 5, sol: true, mol: true },
            content: { block: 'side-nav' }
          },
          {
            elem: 'col',
            elemMods: { sw: 24, lw: 18, lo: 1 },
            content: [
              { block: 'page', elem: 'edit' },
              this.ctx.content
            ]
          },
        ]
      }
    ]
  })
)

block('page').elem('content').mod('layout', 'root')(
  def()(function() {
    var links = this.ctx.content.shift().content
        .filter(function (i) { return i && i.tag})
        .map(function (li) {
          var link = li.content[0] 
          return {
            block: 'button',
            mods: { theme: 'islands', size: 'xl', type: 'link' },
            url: link.attrs.href,
            text: link.content
          }
        })
    return [
      applyCtx({ block: 'hero', content: links }),
      applyCtx({
        block: 'row',
        content: [
          { 
            elem: 'col',
            elemMods: { sw: 24 },
            content: applyNext()
          }
        ]
      })
    ]
  })
)
