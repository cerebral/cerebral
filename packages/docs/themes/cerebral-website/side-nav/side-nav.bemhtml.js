block('side-nav')(
  content()(function () {
    return {
      block: 'menu',
      mods: { theme: 'islands', size: 'xl', mode: 'radio' },
      val: [this._layout, this._name].join('/'),
      content: this._data.documentation.map(function (page) {
        return {
          block: 'menu-item',
          mods: { theme: 'islands', size: 'xl', type: 'link' },
          val: [page.layout, page.name].join('/'),
          content: {
            block: 'link',
            url: '../documentation/' + page.name+ '.html',
            content: page.name
          }
        }
      })
    }
  })
)
