module.exports = tree => {
  tree.match({ tag: 'a', attrs: { href: /.*youtube.com\/watch\?v=.*/ } }, node => {
    return {
      tag: 'iframe',
      attrs: {
        width: 420,
        height: 315,
        frameborder: 0,
        allowfullscreen: true,
        style: { 'max-width': '100%' },
        src: node.attrs.href.replace('watch?v=', 'embed/')
      }
    }
  })
}
