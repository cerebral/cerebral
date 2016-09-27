module.exports = tree => {
  tree.match({ tag: 'a', attrs: { href: /.*youtube.com\/watch\?v=.*/ } }, node => {
    return {
      tag: 'iframe',
      attrs: {
        width: 420,
        height: 315,
        frameborder: 0,
        allowfullscreen: true,
        src: node.attrs.href.replace('watch?v=', 'embed/')
      }
    }
  })
}
