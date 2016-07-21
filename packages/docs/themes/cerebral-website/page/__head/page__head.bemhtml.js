block('page').elem('head')(
  content()(function() {
    return [
      applyNext(),
      {
        elem : 'meta',
        attrs : {
          name : 'viewport',
          content : 'width=device-width,' +
            (this._zoom?
              'initial-scale=1' :
              'maximum-scale=1,initial-scale=1,user-scalable=no')
        }
      },
      { elem : 'meta', attrs : { name : 'format-detection', content : 'telephone=no' } },
      { elem : 'link', attrs : { name : 'apple-mobile-web-app-capable', content : 'yes' } }
    ]
  })
)

block('page').elem('head').match(function (){
  return this._meta && this._meta.redirect
})(
  content()(function () {
    return applyNext().concat([
      { elem: 'meta', attrs: { 'http-equiv': 'refresh', content: '0; url="' + this._meta.redirect + '.html"' } }
    ])
  })
)
