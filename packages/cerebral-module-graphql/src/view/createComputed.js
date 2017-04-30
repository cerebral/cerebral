import {state} from 'cerebral/tags'
import {compute} from 'cerebral'
import queryCache from '../queryCache'

function getQueryStructure (queryStructure) {
  switch (queryStructure.kind) {
    case 'Document':
      return getQueryStructure(queryStructure.definitions[0])
    case 'OperationDefinition':
      return getQueryStructure(queryStructure.selectionSet)
    case 'SelectionSet':
      return queryStructure.selections.map(getQueryStructure)
    case 'Field':
      return queryStructure
  }
}

function buildQueryFieldList (queryFields, ids, objectType, objectTypes, queryTypes, get) {
  return ids.map((id) => {
    const objectPath = `graphql.entities.${objectType.name}.${id}`
    return buildQueryResultFields(queryFields, objectPath, objectType, objectTypes, queryTypes, get)
  })
}

function buildQueryResultFields (queryFields, objectPath, objectType, objectTypes, queryTypes, get) {
  return Object.keys(objectType.fields).reduce((obj, fieldKey) => {
    const field = objectType.fields[fieldKey]
    const fieldExists = Boolean(queryFields.filter((field) => field.name.value === fieldKey).length)

    if (!fieldExists) {
      return obj
    }

    if (field.isObjectType && field.isList) {
      const objectType = objectTypes[field.name]
      const fieldQueryFields = queryFields.reduce((currentQueryStructure, field) => {
        return currentQueryStructure || field.name.value === fieldKey && field.selectionSet.selections
      }, null)

      obj[fieldKey] = buildQueryFieldList(fieldQueryFields, get(state`${objectPath}.${fieldKey}`), objectType, objectTypes, queryTypes, get)
    } else {
      obj[fieldKey] = get(state`${objectPath}.${fieldKey}`)
    }

    return obj
  }, {})
}

export default function createComputed (query) {
  return compute((get) => {
    const objectTypes = get(state`graphql.objectTypes`)
    const queryTypes = get(state`graphql.queryTypes`)
    const queryStatus = get(state`graphql.queries.${query}`)

    if (!queryStatus || queryStatus.isLoading) {
      return {
        isLoading: !queryStatus || queryStatus.isLoading
      }
    }

    const queryStructure = queryCache.get(query).ast
    const objectQueryStructures = getQueryStructure(queryStructure)

    return objectQueryStructures.reduce((object, objectQueryStructure) => {
      const objectType = objectTypes[queryTypes[objectQueryStructure.name.value].name]
      const id = queryStatus.objectIds[objectQueryStructure.name.value]

      let objectPath
      if (id) {
        objectPath = `graphql.entities.${objectType.name}.${id}`
      } else {
        const objects = get(state`graphql.entities.${objectType.name}.!`)
        const lookupField = objectQueryStructure.arguments[0].name.value
        const lookupValue = objectQueryStructure.arguments[0].value.value

        objectPath = Object.keys(objects).reduce((currentPath, objectKey) => {
          if (objects[objectKey][lookupField] === lookupValue) {
            return `graphql.entities.${objectType.name}.${objectKey}`
          }

          return currentPath
        }, null)
      }
      const queryFields = objectQueryStructure.selectionSet.selections
      return Object.assign(object, {
        [objectQueryStructure.name.value]: buildQueryResultFields(queryFields, objectPath, objectType, objectTypes, queryTypes, get)
      })
    }, {})

    return object
  })
}
