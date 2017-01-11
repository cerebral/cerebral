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
export const input = createTemplateTag('input')
export const signal = createTemplateTag('signal')
export const props = createTemplateTag('props')
export const string = createTemplateTag('string', {
  hasValue: false
})
