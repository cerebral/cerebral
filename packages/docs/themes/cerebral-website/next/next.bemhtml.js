block('next')(
  replace()(function () {
    var sideNav = this._data.root[0].meta['side-nav']
    var layoutMeta = this._data[this._layout].filter(function (page) { return page.name === 'index' })[0].meta || {}
    var pages = layoutMeta.pages || []

    for (var i = 0; i < pages.length; i++) {
      if (pages[i][0] === this._name) break
    }

    var next = pages[i + 1]

    if (!next) {
      var nextLayout = sideNav[sideNav.indexOf(this._layout) + 1]
      var nextMeta = nextLayout && this._data[nextLayout].filter(function (page) { return page.name === 'index' })[0].meta
      next = nextMeta && nextMeta.pages && nextMeta.pages[0] 
    }

    return next && {
      block: 'link',
      mix: { block: 'next' },
      mods: { theme: 'islands', size: 'xl' },
      url: (nextLayout ? '../' + nextLayout + '/' : './') + next[0] + '.html',
      content: [
        { block: 'next', elem: 'label', content: 'Next' },
        { block: 'next', elem: 'title', content: next[1] }
      ] 
    }
  })
)
