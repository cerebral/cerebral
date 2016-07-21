block('hero').elem('buttons')(
  content()(function () {
    var base = this._layout === 'root' ? './' : '../'
    var links

    try {
      links = this._data.root[0].content[0].content
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
    } catch (e) {
      links = []
    }

    return links
  })
)
