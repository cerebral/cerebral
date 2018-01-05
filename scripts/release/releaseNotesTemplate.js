import md5 from 'md5'

function createNewVersionsTable(release) {
  const entries = Object.keys(release.newVersionByPackage)
    .filter(packageName => {
      return (
        release.currentVersionByPackage[packageName] !==
        release.newVersionByPackage[packageName]
      )
    })
    .map(packageName => {
      return `| ${packageName} | ${release.currentVersionByPackage[
        packageName
      ]} | ${release.newVersionByPackage[packageName]} |`
    })

  if (!entries.length) {
    return ''
  }

  return `## Updated packages

| package | from version | to version |
|:---|:---|:---|
${entries.join('\n')}
`
}

function byPackageName(a, b) {
  if (a.packageName > b.packageName) return 1
  else if (a.packageName < b.packageName) return -1
  else return 0
}

const typeHeaders = {
  feat: ':fire: Feature change',
  fix: ':bug: Bug fixes',
  docs: ':paperclip: Documentation',
  chore: ':wrench: Chores',
  style: ':pencil2: Styling',
  refactor: ':mag: Refactors',
  perf: ':runner: Performance',
  test: ':vertical_traffic_light: Tests',
  ts: ':pencil: Typescript',
}

function createChangeTable(type, release) {
  const entries = release.summary[type]
    .reduce((allEntries, summary) => {
      return allEntries.concat(
        summary.commits.map(commit => {
          return {
            packageName: summary.name,
            summary: commit.summary,
            issues: commit.issues,
            hash: commit.hash,
            authorName: commit.author.name,
            authorEmail: commit.author.email,
          }
        })
      )
    }, [])
    .sort(byPackageName)

  return `## ${typeHeaders[type]}
| package | summary | commit | issues | author | gravatar |
|:---|:---|:---|:---|:---|---|
${entries
    .map(entry => {
      return `| ${entry.packageName} | ${entry.summary} | ${entry.hash} | ${entry.issues.join(
        ', '
      )} | ${entry.authorName} | ![${entry.authorName}](https://www.gravatar.com/avatar/${md5(
        entry.authorEmail
      )}?s=40) |`
    })
    .join('\n')}
`
}

function createBreakingTable(release) {
  const entries = Object.keys(release.summary)
    .reduce((allTypes, type) => {
      return allTypes.concat(
        release.summary[type].reduce((allEntries, summary) => {
          const onlyBreaking = summary.commits.filter(
            commit => commit.breaks.length
          )

          // Mutate in place (easier :))
          summary.commits = summary.commits.filter(
            commit => !commit.breaks.length
          )

          return allEntries.concat(
            onlyBreaking.map(commit => {
              return {
                packageName: summary.name,
                summary: commit.summary,
                breaks: commit.breaks,
                issues: commit.issues,
                hash: commit.hash,
                authorName: commit.author.name,
                authorEmail: commit.author.email,
              }
            })
          )
        }, [])
      )
    }, [])
    .sort(byPackageName)

  if (!entries.length) {
    return ''
  }

  return `## :rotating_light: Breaking
| package | summary | commit | issues | author | gravatar |
|:---|:---|:---|:---|:---|---|
${entries
    .map(entry => {
      return `| ${entry.packageName} | ${entry.summary} <ul>${entry.breaks
        .map(text => `<li>*${text}*</li>`)
        .join('')}</ul> | ${entry.hash} | ${entry.issues.join(
        ', '
      )} | ${entry.authorName} | ![${entry.authorName}](https://www.gravatar.com/avatar/${md5(
        entry.authorEmail
      )}?s=40) |`
    })
    .join('\n')}
`
}

function createOtherTable(release) {
  if (!release.commitsWithoutPackage.length) {
    return ''
  }

  return `## :relieved: Other
| type | summary | commit | issues | author | gravatar |
|---|:---|:---|:---|:---|---|
${release.commitsWithoutPackage
    .stort((commitA, commitB) => {
      const typeA = commitA.type.toUpperCase()
      const typeB = commitB.type.toUpperCase()

      if (typeA < typeB) return -1
      if (typeA > typeB) return 1
      return 0
    })
    .map(entry => {
      return `| ${entry.type} (${entry.scope ||
        'monorepo'}) | ${entry.summary} | ${entry.hash} | ${entry.issues.join(
        ', '
      )} | ${entry.author.name} | ![${entry.author
        .email}](https://www.gravatar.com/avatar/${md5(
        entry.author.email
      )}?s=40) |`
    })
    .join('\n')}
`
}

export default release => {
  const breaking = Object.keys(release.summary).map(type =>
    createBreakingTable(release)
  )
  const changes = Object.keys(typeHeaders).map(
    type => (release.summary[type] ? createChangeTable(type, release) : '')
  )

  const other = createOtherTable(release)

  return `
${createNewVersionsTable(release)}
${breaking.join('\n')}
${changes.join('\n')}
${other}
`
}
