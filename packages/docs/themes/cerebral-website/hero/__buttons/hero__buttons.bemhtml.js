block('hero').elem('buttons')(
  content()(function () {
    var base = this._layout === 'root' ? './' : '../'
    return [
      {
        block: 'button',
        mods: { theme: 'islands', size: 'xl', type: 'link' },
        url: 'http://cerebral.github.io/cerebral-todomvc/',
        text: 'TRY THE DEMO'
      },
      {
        block: 'button',
        mods: { theme: 'islands', size: 'xl', type: 'link' },
        url: base + 'documentation/introduction.html',
        text: 'TUTORIAL'
      },
      {
        block: 'button',
        mods: { theme: 'islands', size: 'xl', type: 'link', view: 'action' },
        url: base + 'documentation/get-started.html',
        text: 'GET STARTED'
      }
    ]
  })
)
