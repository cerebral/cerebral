import Tag from './tags/Tag'

export class Compute {
  constructor (args) {
    this.args = args
    this.value = null
  }
  getValue (get) {
    const result = this.args.reduce((details, arg, index) => {
      if (arg instanceof Compute || arg instanceof Tag) {
        details.results.push(arg.getValue(get))

        return details
      } else if (typeof arg === 'function') {
        details.results.push(arg(...details.results.slice(details.previousFuncIndex, index), get))
        details.previousFuncIndex = index

        return details
      }

      details.results.push(arg)

      return details
    }, {
      results: [],
      previousFuncIndex: 0
    })

    return result.results[result.results.length - 1]
  }
}

export default function compute (...args) {
  return new Compute(args)
}
