block('side-nav')(
  content()(function () {
    var data = this._data

    return {
      block: 'menu',
      mods: { theme: 'islands', size: 'xl', mode: 'radio' },
      val: [this._layout, this._name].join('/'),
      content: Object.keys(data).map(function (layout) {
        if (layout === 'root') return
        if (data[layout].length === 1) {
          var page = data[layout][0]

          return {
            block: 'menu-item',
            mods: { type: 'link' },
            val: [page.layout, page.name].join('/'),
            content: {
                block: 'link',
                url: '../' + page.layout + '/' + page.name + '.html',
                content: layout
            }
          }
        }
        return {
          elem: 'group',
          title: layout,
          content: data[layout].map(function (page) {
            if (page.name === 'index') return

            return {
              block: 'menu-item',
              mods: { type: 'link' },
              val: [page.layout, page.name].join('/'),
              content: {
                 block: 'link',
                 url: '../' + page.layout + '/' + page.name + '.html',
                 content: page.name
              }
            }
          }).filter(function (i) { return !!i })
        }
      }).filter(function (i) { return !!i }) // fix menu.bemhtml issues
    }
  })
)
