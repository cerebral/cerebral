import Tag from './Tag'

function createTemplateTag (tag, options = {}) {
  return (strings, ...values) => {
    return new Tag(tag, options, strings, values)
  }
}

export {default as Tag} from './Tag'
export const state = createTemplateTag('state', {
  isStateDependency: true
})

const inputTemplateTag = createTemplateTag('input')
export const input = function (...args) {
  console.warn('DEPRECATION: The INPUT template tag is deprecated, use props')

  return inputTemplateTag(...args)
}
export const signal = createTemplateTag('signal')
export const props = createTemplateTag('props')
export const string = createTemplateTag('string', {
  hasValue: false
})
