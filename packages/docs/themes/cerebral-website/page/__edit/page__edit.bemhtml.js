block('page').elem('edit')(
  content()(function () {
    var url = 'https://github.com/cerebral/cerebral/tree/master/packages/docs/content/'

    if (this._layout !== 'root') {
      url += this._layout + '/'
    }

    url += [this._name, this._lang, 'md'].join('.')

    return {
      block: 'link',
      mods: { theme: 'islands' },
      url: url,
      content: 'Edit on GitHub'
    }
  })
)
