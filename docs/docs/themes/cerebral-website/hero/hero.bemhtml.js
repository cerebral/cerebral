block('hero')(
  content()(function () {
    return [
      { elem: 'logo' },
      { elem: 'heading' },
      { elem: 'buttons', content: this.ctx.content }
    ]
  })
)
