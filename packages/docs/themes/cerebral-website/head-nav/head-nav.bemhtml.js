block('head-nav')(
  content()(function () {
    return [
      {
        block: 'link',
        mix: { block: 'head-nav', elem: 'home' },
        url: '../',
        content: 'Cerebral'
      }
    ]
  })
)
