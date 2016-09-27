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
    process.env.NODE_ENV === 'build' ? require('./plugins/posthtml-images') : () => {},
    require('./plugins/posthtml-links'),
    require('./plugins/posthtml-prism'),
    require('./plugins/posthtml-youtube')
  ),
  "postcssPlugins": [
    require('sharps').postcss({
      columns: 24,
      maxWidth: '1100px',
      gutter: '0',
      flex: 'flex'
    }),
    require('autoprefixer')(),
    require('postcss-url')({ url: 'inline' }),
    require('cssnano')()
  ]
}
