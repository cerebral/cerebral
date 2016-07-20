block('page')(
  def()(function () {
    this.ctx.vendors.css = [
      {
        elem: 'css',
        url: 'https://fonts.googleapis.com/css?family=Roboto:700,500,400'
      },
      {
        elem: 'css',
        url: 'https://fonts.googleapis.com/css?family=Roboto+Mono'
      }
    ]

    return applyNext();
  }),
  content()(function() {
    return [
      { elem: 'header' },
      {
        elem: 'content',
        content: this.ctx.content
      },
      {
        block: 'footer',
        mix: { block: 'page', elem: 'footer' }
      },
      this.ctx.scripts
    ]
  })
)
