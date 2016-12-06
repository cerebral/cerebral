/* eslint-disable no-useless-escape */
export default function syntaxHighlight (json) {
  const regExp = /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g
  return json.replace(regExp, (match) => {
    var style = `color: #1177cd`
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        style = `color: #8dc379;`
      } else {
        style = `color: #c178dd`
      }
    } else if (/true|false/.test(match)) {
      style = 'color: #cb9a66'
    } else if (/null/.test(match)) {
      style = `color: #d19a66`
    }
    return `<span style="${style}">${match}</span>`
  })
}
