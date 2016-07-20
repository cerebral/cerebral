block('tabs')(
  js()(true),
  content()(function () {
    return [
      {
          block: 'radio-group',
          mods: { theme : 'islands', size : 'l', type : 'button' },
          val: 0,
          options: this.ctx.content.map(function (tab, index) {
            return { val: index, text: tab.name }
          })
      },
      applyNext()
    ] 
  })
)
