block('side-nav')(
  content()(function () {
    var data = this._data

    return {
      block: 'menu',
      mods: { theme: 'islands', size: 'xl', mode: 'radio' },
      val: [this._layout, this._name].join('/'),
      content: data.root[0].meta['side-nav']
        .filter(function (layout) {
          var index = data[layout].filter(function (page) { return page.name === 'index' })[0]
          return index.meta.pages && index.meta.pages.length 
        })
        .map(function (layout) {
          var index = data[layout].filter(function (page) { return page.name === 'index' })[0]
          var pages = index.meta.pages
          return {
              elem: 'group',
              title: index.meta.title || layout,
              content: pages.map(function (page) {
                return {
                  block: 'menu-item',
                  mods: { type: 'link' },
                  val: [layout, page[0]].join('/'),
                  content: {
                    block: 'link',
                    url: '../' + layout + '/' + page[0] + '.html',
                    content: page[1] || page[0]
                  }
                }
              })
          }
        })
    }
  })
)
