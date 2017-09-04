module.exports = function prismJsxTs(Prism) {
  Prism.languages.typescript = Prism.languages.extend('javascript', {
    keyword: /\b(break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield|module|declare|constructor|string|Function|any|number|boolean|Array|enum)\b/,
  })

  var javascript = Prism.util.clone(Prism.languages.typescript)

  Prism.languages.ts = Prism.languages.extend('markup', javascript)
  Prism.languages.ts.tag.pattern = /<\/?[\w\.:-]+\s*(?:\s+[\w\.:-]+(?:=(?:("|')(\\?[\w\W])*?\1|[^\s'">=]+|(\{[\w\W]*?\})))?\s*)*\/?>/i // eslint-disable-line

  Prism.languages.ts.tag.inside[
    'attr-value'
  ].pattern = /=[^\{](?:('|")[\w\W]*?(\1)|[^\s>]+)/i // eslint-disable-line

  var jsxExpression = Prism.util.clone(Prism.languages.jsx)

  delete jsxExpression.punctuation

  jsxExpression = Prism.languages.insertBefore(
    'jsx',
    'operator',
    {
      punctuation: /=(?={)|[{}[\];(),.:]/,
    },
    { jsx: jsxExpression }
  )

  Prism.languages.insertBefore(
    'inside',
    'attr-value',
    {
      script: {
        // Allow for one level of nesting
        pattern: /=(\{(?:\{[^}]*\}|[^}])+\})/i,
        inside: jsxExpression,
        alias: 'language-javascript',
      },
    },
    Prism.languages.jsx.tag
  )
}
