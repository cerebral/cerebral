/* global block */

block('youtube')
  .content()(function () {
    return {
      elem: 'iframe',
      tag: 'iframe',
      attrs: {
        frameborder: 0,
        allowfullscreen: true,
        src: this.ctx.href.replace('watch?v=', 'embed/')
      }
    }
  })
