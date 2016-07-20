modules.define('tabs', ['i-bem__dom', 'jquery'], function(provide, BEMDOM, $) {

  provide(BEMDOM.decl(this.name,
    {
      onSetMod: {
        'js': {
          'inited': function() {
            this.findBlockInside('radio-group').on('change', function (e) {
              var active = $(this.elem('tab')[e.target.getVal()])

              this.delMod(this.elem('tab'), 'active')
              this.setMod(active, 'active')

              var image = active.children('.image')

              if (image && !image.attr('src')) {
                image.attr('src', image.attr('data-src'))
              }
            }, this)
          }
        }
      }
    })
  )
})
