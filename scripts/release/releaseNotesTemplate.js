function Commit(item) {
  return `
  - ${item.summary} ${item.issues.length
    ? '(' + item.issues.join(', ') + ')'
    : ''} - *${item.author.name}*
    ${item.breaks
      .map(item => {
        return `- ${item}`
      })
      .join('\n')}
`
}

function Package(item) {
  return `
#### ${item.name} - ${item.version}
  ${item.commits.map(Commit).join('\n')}
`
}

function writeBreaks(breaks) {
  if (!breaks) {
    return ''
  }

  return `
## ${breaks.length} breaking
${breaks.map(Package).join('\n')}
---
`
}

function writeFixes(fix) {
  if (!fix) {
    return ''
  }

  return `
## ${fix.length} ${fix.length === 1 ? 'fix' : 'fixes'}
${fix.map(Package).join('\n')}
---
`
}

function writeFeat(feat) {
  if (!feat) {
    return ''
  }

  return `
## ${feat.length} ${feat.length === 1 ? 'feature' : 'features'}
${feat.map(Package).join('\n')}
---
`
}

function writeDocs(docs) {
  if (!docs) {
    return ''
  }

  return `
## documentation
${docs.map(Package).join('\n')}
---
`
}

function writeChore(chore) {
  if (!chore) {
    return ''
  }

  return `
## ${chore.length} ${chore.length === 1 ? 'chore' : 'chores'}
${chore.map(Package).join('\n')}
---
`
}

export default release => {
  return `${writeBreaks(release.summary.breaks)}
${writeFixes(release.summary.fix)}
${writeFeat(release.summary.feat)}
${writeDocs(release.summary.docs)}
${writeChore(release.summary.chore)}

With :heart: from the Cerebral Team!
`
}
