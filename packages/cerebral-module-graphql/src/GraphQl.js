import {GraphQLObjectType, GraphQLScalarType, GraphQLNonNull, GraphQLList} from 'graphql'
import {normalize, schema as normalizrSchema} from 'normalizr';
import {parse, print, visit, visitor} from 'graphql/language'
import {isFieldsOfObjectType, getMissingIdFieldName, getMissingArgFieldNames} from './utils'
import queryCache from './queryCache'

class GraphQl {
  constructor (schema) {
    this.schema = schema
    this.queryTypes = this.getQueryTypes(this.schema)
    this.objectTypes = this.getObjectTypes(this.schema)
  }
  addQuery (queries) {
    return (Array.isArray(queries) ? queries : [queries]).reduce((currentMergedQueries, query) => {
      if (!currentMergedQueries) {
        return this.createQueryAst(query)
      }

      const queryAst = this.addQuery(query)

      return Object.assign({}, currentMergedQueries, {
        definitions: currentMergedQueries.definitions.map((definition) => {
          return Object.assign({}, definition, {
            selectionSet: Object.assign({}, definition.selectionSet, {
              selections: definition.selectionSet.selections.concat(
                queryAst.definitions[0].selectionSet.selections
              )
            })
          })
        })
      })
    }, null)
  }
  createQueryAst (query) {
    if (queryCache.get(query)) {
      return queryCache.get(query)
    }

    const self = this
    const ast = visit(parse(query), {
      enter(node, key, parent, path, ancestors) {
        if (isFieldsOfObjectType(node, parent, self.queryTypes)) {
          const objectType = self.objectTypes[self.queryTypes[parent.name.value].name]
          const missingIdFieldName = getMissingIdFieldName(node, objectType)
          const missingArgFieldNames = getMissingArgFieldNames(parent, objectType)

          node.selections = node.selections.concat(
            missingIdFieldName && missingArgFieldNames.indexOf(missingIdFieldName) === -1 ? {
              kind: 'Field',
              alias: null,
              name: {kind: 'Name', value: missingIdFieldName},
              arguments: [],
              directives: [],
              selectionSet: null
            } : []
          ).concat(missingArgFieldNames.map((missingArgFieldName) => ({
            kind: 'Field',
            alias: null,
            name: {kind: 'Name', value: missingArgFieldName},
            arguments: [],
            directives: [],
            selectionSet: null
          })))

          return node
        }
      }
    })

    return queryCache.add(query, ast)
  }
  /*
    Normalizes data structure based on query
  */
  normalize (query, data) {
    const queryStructure = queryCache.get(query)
    const queryStructuresWithRelations = this.createQueryStructureWithRelations(queryStructure)

    return queryStructuresWithRelations.reduce((result, queryStructureWithRelations) => {
      const normalizeSchema = this.createNormalizeSchema(queryStructureWithRelations)
      const jsData = JSON.parse(JSON.stringify(data[queryStructureWithRelations.fieldName]))
      const normalized = normalize(jsData, normalizeSchema)

      result.entities = Object.assign(result.entities, normalized.entities)
      result.objectIds[queryStructureWithRelations.fieldName] = normalized.result

      return result
    }, {
      objectIds: {},
      entities: {}
    })
  }
  getQueryTypes (schema) {
    return Object.keys(schema._queryType._fields).reduce((currentObjectTypes, fieldKey) => {
      currentObjectTypes[fieldKey] = schema._queryType._fields[fieldKey].type instanceof GraphQLList ? {
        name: schema._queryType._fields[fieldKey].type.ofType.name,
        isList: true
      } : {
        name: schema._queryType._fields[fieldKey].type.name || schema._queryType._fields[fieldKey].type.ofType.name
      }

      return currentObjectTypes
    }, {})
  }
  getObjectTypes (schema) {
    return Object.keys(schema._typeMap).reduce((currentObjectTypes, fieldKey) => {
      if (
        fieldKey.substr(0, 2) !== '__' &&
        fieldKey !== 'Query' &&
        schema._typeMap[fieldKey] instanceof GraphQLObjectType
      ) {
        currentObjectTypes[fieldKey] = {
          name: fieldKey,
          fields: this.getObjectTypeFields(schema._typeMap[fieldKey]._fields)
        }
      }

      return currentObjectTypes
    }, {})
  }
  getObjectTypeFields (fields) {
    return Object.keys(fields || {}).reduce((currentObjectTypeFields, objectTypeFieldKey) => {
      const type = fields[objectTypeFieldKey].type

      if (type instanceof GraphQLObjectType) {
        currentObjectTypeFields[objectTypeFieldKey] = {
          isObjectType: true,
          name: type.name
        }
      } else if (type instanceof GraphQLScalarType) {
        currentObjectTypeFields[objectTypeFieldKey] = {
          name: type.name
        }
      } else if (type instanceof GraphQLNonNull) {
        currentObjectTypeFields[objectTypeFieldKey] = {
          name: type.ofType.name
        }
      } else if (type instanceof GraphQLList) {
        currentObjectTypeFields[objectTypeFieldKey] = {
          isObjectType: true,
          isList: true,
          name: type.ofType.name
        }
      }

      return currentObjectTypeFields
    }, {})
  }
  createQueryStructureWithRelations (queryStructure) {
    switch (queryStructure.kind) {
      case 'Document':
        return this.createQueryStructureWithRelations(queryStructure.definitions[0])
      case 'OperationDefinition':
        return this.createQueryStructureWithRelations(queryStructure.selectionSet)
      case 'SelectionSet':
        return queryStructure.selections.map((selection) => this.createQueryStructureWithRelations(selection))
      case 'Field':
        return this.createQueryRelations(queryStructure, this.objectTypes[this.queryTypes[queryStructure.name.value].name])
    }
  }
  createQueryRelations (queryStructure, objectType) {
    return {
      name: objectType.name,
      fieldName: queryStructure.name.value,
      fields: queryStructure.selectionSet ? queryStructure.selectionSet.selections.reduce((newQueryType, field) => {
        const objectTypeField = objectType.fields[field.name.value]

        if (objectTypeField.isObjectType) {
          newQueryType[field.name.value] = this.createQueryRelations(field, this.objectTypes[objectTypeField.name])
        }

        return newQueryType
      }, {}) : {}
    }
  }
  createNormalizeSchema (queryStructureWithRelations) {
    const objectType = this.objectTypes[queryStructureWithRelations.name]

    return new normalizrSchema.Entity(queryStructureWithRelations.name, Object.keys(queryStructureWithRelations.fields).reduce((currentFields, field) => {
      const fieldType = this.objectTypes[queryStructureWithRelations.fields[field].name]

      currentFields[field] = objectType.fields[field].isList ? [this.createNormalizeSchema(queryStructureWithRelations.fields[field])] : this.createNormalizeSchema(queryStructureWithRelations.fields[field])

      return currentFields
    }, {}))
  }
}

export default GraphQl
