import {GraphQLObjectType, GraphQLScalarType, GraphQLNonNull, GraphQLList} from 'graphql'
import qlt from 'graphql-tag'
import {normalize, schema as normalizrSchema} from 'normalizr';

class GraphQl {
  constructor (schema) {
    this.schema = schema
    this.queryTypes = this.getQueryTypes(this.schema)
    this.objectTypes = this.getObjectTypes(this.schema)
  }
  /*
    Normalizes data structure based on query
  */
  normalize (query, data) {
    const queryStructure = qlt`${query}`
    const queryStructuresWithRelations = this.createQueryStructureWithRelations(queryStructure)

    return queryStructuresWithRelations.reduce((entities, queryStructureWithRelations) => {
      const normalizeSchema = this.createNormalizeSchema(queryStructureWithRelations)
      const jsData = JSON.parse(JSON.stringify(data[queryStructureWithRelations.fieldName]))

      return Object.assign(entities, normalize(jsData, normalizeSchema).entities)
    }, {})
  }
  getQueryTypes (schema) {
    return Object.keys(schema._queryType._fields).reduce((currentObjectTypes, fieldKey) => {
      currentObjectTypes[fieldKey] = schema._queryType._fields[fieldKey].type instanceof GraphQLList ? {
        name: schema._queryType._fields[fieldKey].type.ofType.name,
        isList: true
      } : {
        name: schema._queryType._fields[fieldKey].type.name
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
