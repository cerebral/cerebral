import proxyTags from 'babel-plugin-cerebral-proxy-tags'
import optimizeTags from 'babel-plugin-cerebral-optimize-tags'

export default function (context, opts = {}) {
  const config = {
    plugins: [
      opts.proxies && proxyTags,
      optimizeTags
    ].filter(Boolean)
  }
  return config
}
