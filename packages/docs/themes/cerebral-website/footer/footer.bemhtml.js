block('footer')(
  tag()('footer'),
  content()(function () {
    var base = this._layout === 'root' ? './' : '../'
    return {
      block: 'row',
      content: [
        {
          block: 'row',
          elem: 'col',
          elemMods: { sw: 24, lw: 6 },
          content: [
            { block: 'footer', elem: 'header', content: 'ORGANIZATION' },
            { block: 'footer', elem: 'link', url: base + 'contributors', content: 'Contributors' }
          ]
        },
        {
          block: 'row',
          elem: 'col',
          elemMods: { sw: 24, lw: 6, lo: 3 },
          content: [
            { block: 'footer', elem: 'header', content: 'ARTICLES AND USEFUL LINKS' }
          ]
        },
        {
          block: 'row',
          elem: 'col',
          elemMods: { sw: 24, lw: 6, lo: 6 },
          content: [
            { block: 'footer', elem: 'header', content: 'HELP' }
          ]
        }
      ]
    }
  })
)
