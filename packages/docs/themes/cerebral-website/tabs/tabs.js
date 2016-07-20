modules.define('tabs', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

  provide(BEMDOM.decl(this.name,
    {
      onSetMod: {
        'js': {
          'inited': function() {
            this.findBlockInside('radio-group').on('change', function (e) {
              var index = e.target.getVal()
              this.delMod(this.elem('tab'), 'active')
              this.setMod($(this.elem('tab')[index]), 'active')
            }, this)
          }
        }
      }
    })
  )
})
