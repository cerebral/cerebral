function sortByTotalCo2 (source) {
  return (keyA, keyB) => {
    if (source[keyA].totalCo2 > source[keyB].totalCo2) {
      return -1
    } else if (source[keyA].totalCo2 < source[keyB].totalCo2) {
      return 1
    }

    return 0
  }
}

module.exports = sortByTotalCo2
