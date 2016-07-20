block('tabs')(
  js()(true),
  content()(function () {
    var buttons = []
    return [
      {
          block : 'radio-group',
          mods : { theme : 'islands', size : 'l', type : 'button' },
          options : buttons
      },
      this.ctx.content.map(function (tab, index) {
        tab.mix = { block: 'tabs', elem: 'tab', elemMods: { active: !index } }

        if (tab.tag === 'pre') {
          var code = tab.content[0].content
          buttons.push({
            val: index,
            text: code[0].split('\n')[0].replace('// ', '')
          })
          code[0] = code[0].split('\n').splice(1).join('\n')
        } else if (tab.tag === 'img') {
          buttons.push({
            val: index,
            text: tab.attrs.alt
          })
        }
        return tab
      })
    ] 
  })
)
