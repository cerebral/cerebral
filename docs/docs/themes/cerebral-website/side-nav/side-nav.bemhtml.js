block('side-nav')(
  content()(function () {
    var data = this._data
    var layouts = this._layouts

    return {
      block: 'menu',
      mods: { theme: 'islands', size: 'xl', mode: 'radio-check' },
      val: [this._layout, this._name].join('/'),
      content: data.root[0].meta['side-nav']
        .map(function (layout) {
          var index
          if (layouts[layout] && layouts[layout].index) {
            index = layouts[layout].index
          } else {
            throw new Error(layout + '/index.en.md wasn\'t found in `content` folder.')
          }
          var pages = Object.keys(layouts[layout]).filter(function (pageName) { return pageName !== 'index' })
          return {
            elem: 'group',
            title: index.meta && index.meta.title || layout,
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
