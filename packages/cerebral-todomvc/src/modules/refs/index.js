export default (options = {}) => {
  return (module) => {
    let nextRef = 0

    module.addServices({
      next () {
        return nextRef++
      }
    })
  }
}
