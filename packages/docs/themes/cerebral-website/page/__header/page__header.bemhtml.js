block('page').elem('header').mod('layout', 'root')(
  content()({ block: 'hero' })
)

block('page').elem('header').match(function () {
  return this.mods.layout !== 'root'
})(
  content()({ block: 'head-nav' })
)
