var join = require('path').join

module.exports = {
  "themes": [
    join('..', 'node_modules', 'bem-components', 'common.blocks'),
    join('..', 'node_modules', 'bem-components', 'desktop.blocks'),
    join('..', 'node_modules', 'bem-components', 'design', 'common.blocks'),
    join('..', 'node_modules', 'bem-components', 'design', 'desktop.blocks'),
    "cerebral-website"
  ],
  "langs": [
    "en"
  ],
  "output": "dist",
  "debug": false,
  "server": {
    tunnel: false,
    open: false
  },
  "posthtmlPlugins": [].concat(
    require('mad-mark').posthtmlPlugins,
    tree => {
      tree.walk(node => {
        return node.block || node.elem || node.mods || node.elemMods || (node.attrs && node.attrs.class)
          ? node
          : Object.assign(node, { block: node.tag, elem: node.attrs && node.attrs.elem })
      })
    }
  ),
  "postcssPlugins": [
    require('sharps').postcss({
      columns: 24,
      maxWidth: '960px',
      gutter: '0',
      flex: 'flex'
    }),
    require('cssnano')()
  ]
};
