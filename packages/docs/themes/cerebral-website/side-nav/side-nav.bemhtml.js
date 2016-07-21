block('side-nav')(
  content()(function () {
    var data = this._data
    var layouts = this._layouts

    return {
      block: 'menu',
      mods: { theme: 'islands', size: 'xl', mode: 'radio' },
      val: [this._layout, this._name].join('/'),
      content: data.root[0].meta['side-nav']
        .map(function (layout) {
          var index = layouts[layout].index
          var pages = Object.keys(layouts[layout]).filter(function (pageName) { return pageName !== 'index' })
          return {
              elem: 'group',
              title: index.meta.title || layout,
              content: pages.map(function (pageName) {
                var page = layouts[layout][pageName]
                return {
                  block: 'menu-item',
                  mods: { type: 'link' },
                  val: [layout, pageName].join('/'),
                  content: {
                    block: 'link',
                    url: '../' + layout + '/' + pageName + '.html',
                    content: page.meta && page.meta.title || pageName
                  }
                }
              })
          }
        })
    }
  })
)
