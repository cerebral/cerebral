block('page')(
  def()(function () {
    this.ctx.vendors.css = [
      'https://fonts.googleapis.com/css?family=Roboto:700,500,400',
      'https://fonts.googleapis.com/css?family=Roboto+Mono'
    ].map(function (url) { return { elem: 'css', url: url } })

    var base = this._layout === 'root' ? './' : '../'
    this.ctx.favicon = base + 'favicon.ico'

    var data = this._data || {}

    // HACK: to simplify meta lookup by page name
    this._layouts = Object.keys(data).reduce(function (layouts, layoutName) {
      layouts[layoutName] = data[layoutName].reduce(function (pages, page) {
        // TODO: fix overwrite when i18n enabled
        pages[page.name] = page

        return pages
      }, {})

      return layouts
    }, {})

    return applyNext()
  }),
  content()(function () {
    return [
      { elem: 'header' },
      { elem: 'content', content: this.ctx.content },
      { elem: 'footer' },
      this.ctx.scripts
    ]
  })
)
