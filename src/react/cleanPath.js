function cleanPath (path) {
  if (Array.isArray(path)) {
    path = path.join('.')
  }

  return path.replace(/\.\*\*|\.\*/, '')
}

module.exports = cleanPath
