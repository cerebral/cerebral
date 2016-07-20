block('page')(
  def()(function () {
    this.ctx.vendors.css = [
      'https://fonts.googleapis.com/css?family=Roboto:700,500,400',
      'https://fonts.googleapis.com/css?family=Roboto+Mono'
    ].map(function (url) { return { elem: 'css', url: url } })

    var base = this._layout === 'root' ? './' : '../'
    this.ctx.favicon = base + 'favicon.ico'

    return applyNext();
  }),
  content()(function() {
    return [
      { elem: 'header' },
      { elem: 'content', content: this.ctx.content },
      { elem: 'footer' },
      this.ctx.scripts
    ]
  })
)
