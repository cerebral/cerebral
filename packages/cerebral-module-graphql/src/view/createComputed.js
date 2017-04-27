import {state} from 'cerebral/tags'
import {compute} from 'cerebral'
import qlt from 'graphql-tag'

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

function getObjectId (objectQueryStructure) {
  return objectQueryStructure.arguments.reduce((id, argument) => {
    return id || argument.name.value === 'id' && argument.value.value
  }, null)
}

function buildQueryFieldObject () {

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

    const queryStructure = qlt`${query}`

    const objectQueryStructures = getQueryStructure(queryStructure)

    return objectQueryStructures.reduce((object, objectQueryStructure) => {
      const objectType = objectTypes[queryTypes[objectQueryStructure.name.value].name]
      const objectPath = `graphql.entities.${objectType.name}.${getObjectId(objectQueryStructure)}`
      const queryFields = objectQueryStructure.selectionSet.selections
      return Object.assign(object, {
        [objectQueryStructure.name.value]: buildQueryResultFields(queryFields, objectPath, objectType, objectTypes, queryTypes, get)
      })
    }, {})

    return object
  })
}
