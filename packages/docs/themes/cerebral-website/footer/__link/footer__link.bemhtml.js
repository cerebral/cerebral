block('footer').elem('link')(
  replace()(function () {
    return {
      block: 'link',
      mix: { block: 'footer', elem: 'link' },
      url: this.ctx.url,
      content: this.ctx.content
    }
  })
)
