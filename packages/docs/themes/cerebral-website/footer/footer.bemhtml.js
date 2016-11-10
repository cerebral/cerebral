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
            { block: 'footer', elem: 'link', url: base + 'contributors', content: 'Contributors' },
            { block: 'footer', elem: 'link', url: 'http://www.webpackbin.com', content: 'www.webpackbin.com' },
            { block: 'footer', elem: 'link', url: 'http://www.christianalfoni.com', content: 'www.christianalfoni.com' }
          ]
        },
        {
          block: 'row',
          elem: 'col',
          elemMods: { sw: 24, lw: 6, lo: 3 },
          content: [
            { block: 'footer', elem: 'header', content: 'ARTICLES AND USEFUL LINKS' },
            { block: 'footer', elem: 'link', url: 'http://medium.com/p/5793c08db2cc', content: 'The story of Cerebral' },
            { block: 'footer', elem: 'link', url: 'https://gist.github.com/christianalfoni/b08a99faa09df054afe87528a2134730', content: 'An unlikely success story' }
          ]
        },
        {
          block: 'row',
          elem: 'col',
          elemMods: { sw: 24, lw: 6, lo: 6 },
          content: [
            { block: 'footer', elem: 'header', content: 'HELP' },
            { block: 'footer', elem: 'link', url: 'https://github.com/cerebral/cerebral', content: 'Cerebral github repo' },
            { block: 'footer', elem: 'link', url: 'https://discord.gg/0kIweV4bd2bwwsvH', content: 'Discord chat' }
          ]
        }
      ]
    }
  })
)
