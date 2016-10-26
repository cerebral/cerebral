function extractObject (object) {
  return Object.keys(object).reduce((newObject, key) => {
    if (Array.isArray(object[key])) {
      newObject[key] = extractArray(object[key])
    } else if (object[key] && 'value' in object[key]) {
      newObject[key] = object[key].value
    } else if (object[key] && typeof object[key] === 'object') {
      newObject[key] = extractObject(object[key])
    }

    return newObject
  }, {})
}

function extractArray (array) {
  return array.map((object) => {
    return extractObject(object)
  })
}

export default function formToJSON (form) {
  return extractObject(form)
}
