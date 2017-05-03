# Production

It is recommended to use [Webpack](https://webpack.js.org/) to bundle your application. This is a minimal Webpack config for production to help you reduce the bundle size as much as possible. Make sure you always set **NODE_ENV=production** when you bundle for production:

```js
const webpack = require('webpack')
const path = require('path')

module.exports = {
  // Helpful for error reporting in production
  devtool: 'source-map',
  entry: {
    // Entry to your app
    main: path.resolve('src', 'main.js'),

    // It is a good idea to separate your npm-packages from
    // the application bundle. By creating an entry specifying
    // the packages and using the CommonsChunkPlugin, Wepback will produce
    // a separate JS file that can be cached by the browser. Meaning
    // that application updates will not require users to download the
    // code for these packages again
    vendors: [
      'react',
      'react-dom',
      'other-npm-package'
    ];
  },

  // Output files with hash, also any additional
  // chunks (lazy loading) is to be named with hash
  output: {
    path: path.resolve('dist'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[chunkhash].js'
  },
  module: {
    rules: [

      // CSS loading with css modules
      {
        test: /\.css$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader', options: {modules: true}}
        ]
      },

      // JS loading with babel
      {
        test: /\.js?$/,
        include: [path.resolve('src')],
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['es2015', 'react'],

            // Allows for simple lazy loading
            // (https://webpack.js.org/guides/code-splitting-async/)
            plugins: ['syntax-dynamic-import']
          }
        }]
      }
    ]
  },
  plugins: [
    // Create the index.html file, exposing details
    // about the build (look further down)
    new HtmlWebpackPlugin({
      template: path.resolve('index.template.html'),
      inject: false
    }),

    // Makes the Node environment available in the code,
    // allowing for optimizations. Cerebral and React
    // uses this
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    })

    // Minify the code
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        warnings: false,
        drop_console: true
      },
      mangle: {
        except: ['webpackJsonp'],
        screw_ie8: true
      }
    }),

    // Ensures that the ID of the modules
    // stays the same between builds
    new webpack.HashedModuleIdsPlugin(),

    // Injects the manifest that keeps track
    // of modules registry (saves an HTTP request)
    new InlineManifestWebpackPlugin({
      name: 'webpackManifest'
    }),

    // Defines the vendors chunk and manifest to
    // be put into own files
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendors', 'manifest']
    })
  ]
};
```

The *index.html* file needs to define where these scripts should be added:

```html
<body>
  <%=htmlWebpackPlugin.files.webpackManifest%>
  <script src="<%= htmlWebpackPlugin.files.chunks.vendors.entry %>" type="text/javascript"></script>
  <script src="<%= htmlWebpackPlugin.files.chunks.main.entry %>" type="text/javascript"></script>
</body>
```

## Lazy loading
With the **syntax-dynamic-import** we can easily lazy code any module by simply. Lazy modules automatically gets their own JS file by Webpack, which is loaded on demand into the app:

```js
import('path/to/some/module')
  .then((module) => {
    module.default // export default
    module.someOtherExport // export
  })
```

In combination with a component you could:

```js
connect({
  page: state`app.page`
}
  class App extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        isLoadingModule: false,
        loadedModules: [],
        currentModule: null
      }
    }
    componentWillReceiveProps (newProps) {
      if (newProps.page !== this.props.page && this.state.loadedModules.indexOf(newProps.page) === -1) {
        this.setState({
          isLoadingModule: true
        })
        this.loadModule()
          .then((module) => {
            this.setState({
              currentModule: module.default,
              isLoadingModule: false
            })
          })
      }
    }
    loadModule () {
      switch (this.props.page) {
        case 'dashboard':
          return import('pages/dashboard')
        case 'admin':
          return import('pages/admin')
        default:
          return Promise.resolve(null)
      }
    }
    render () {
      if (this.state.isLoadingModule) {
        return <div>Loading page...</div>
      }

      const Page = this.state.currentModule

      return <Page />
    }
  }
)
```
