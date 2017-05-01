/* eslint-env mocha */
import assert from 'assert'
import GraphQl from './GraphQl'
import createExecutableSchema from './client/createExecutableSchema'
import {parse, print} from 'graphql/language'

describe('GraphQl', () => {
  describe('addQuery', () => {
    it('should ensure objects has the defined id field', () => {
      const graphQl = new GraphQl(createExecutableSchema({
        schema: `
          type Author {
            id: ID!
            firstName: String
          }

          type Query {
            author: Author
          }

          schema {
            query: Query
          }
        `,
        resolvers: {
          Query: {
            author() {}
          }
        }
      }))

      const ast = graphQl.addQuery(`
        {
          author (id: 1) {
            firstName
          }
        }
      `)

      assert.equal(print(ast), `{
  author(id: 1) {
    firstName
    id
  }
}
`)
    })
    it('should ensure objects has the fields used as arguments', () => {
      const graphQl = new GraphQl(createExecutableSchema({
        schema: `
          type Author {
            id: ID!
            firstName: String
            login: String
          }

          type Query {
            author: Author
          }

          schema {
            query: Query
          }
        `,
        resolvers: {
          Query: {
            author() {}
          }
        }
      }))

      const ast = graphQl.addQuery(`
        {
          author (login: "test") {
            firstName
          }
        }
      `)

      assert.equal(print(ast), `{
  author(login: "test") {
    firstName
    id
    login
  }
}
`)
    })
  })
  describe('getQueryTypes', () => {
    it('should convert query types to normalizr friendly structure', () => {
      const graphQl = new GraphQl(createExecutableSchema({
        schema: `
          type Author {
            id: ID!
            firstName: String
          }

          type Query {
            author: Author,
            authors: [Author]
          }

          schema {
            query: Query
          }
        `,
        resolvers: {
          Query: {
            author() {}
          }
        }
      }))

      assert.deepEqual(graphQl.getQueryTypes(graphQl.schema), {
        author: {
          name: 'Author'
        },
        authors: {
          isList: true,
          name: 'Author'
        }
      })
    })
  })
  describe('getObjectTypes', () => {
    it('should convert types to normalizr friendly structure', () => {
      const graphQl = new GraphQl(createExecutableSchema({
        schema: `
          type Author {
            id: ID!
            firstName: String
          }

          type Query {
            author: Author
          }

          schema {
            query: Query
          }
        `,
        resolvers: {
          Query: {
            author() {}
          }
        }
      }))

      assert.deepEqual(graphQl.getObjectTypes(graphQl.schema), {
        Author: {
          name: 'Author',
          fields: {
            firstName: {name: 'String'},
            id: {name: 'ID'}
          }
        }
      })
    })
    it('should convert relational query to normalizr friendly structure', () => {
      const graphQl = new GraphQl(createExecutableSchema({
        schema: `
          type Author {
            id: ID!
            firstName: String
            posts: [Post]
          }

          type Post {
            id: ID!
            title: String
          }

          type Query {
            author: Author
          }

          schema {
            query: Query
          }
        `,
        resolvers: {
          Query: {
            author() {}
          }
        }
      }))

      assert.deepEqual(graphQl.getObjectTypes(graphQl.schema), {
        Author: {
          name: 'Author',
          fields: {
            firstName: {name: 'String'},
            id: {name: 'ID'},
            posts: {
              isList: true,
              isObjectType: true,
              name: 'Post'
            }
          }
        },
        Post: {
          name: 'Post',
          fields: {
            id: {name: 'ID'},
            title: {name: 'String'}
          }
        }
      })
    })
  })
  describe('createQueryStructureWithRelations', () => {
    it('should convert simple query to normalizr friendly structure', () => {
      const graphQl = new GraphQl(createExecutableSchema({
        schema: `
          type Author {
            id: ID!
            firstName: String
          }

          type Query {
            author: Author
          }

          schema {
            query: Query
          }
        `,
        resolvers: {
          Query: {
            author() {}
          }
        }
      }))

      const query = parse(`
        {
          author (id: 1) {
            id,
            firstName
          }
        }
      `)

      assert.deepEqual(graphQl.createQueryStructureWithRelations(query), [{
        name: 'Author',
        fieldName: 'author',
        fields: {}
      }])
    })
    it('should convert relational query to normalizr friendly structure', () => {
      const graphQl = new GraphQl(createExecutableSchema({
        schema: `
          type Author {
            id: ID!
            firstName: String
            posts: [Post]
          }

          type Post {
            id: ID!
            title: String
          }

          type Query {
            author: Author
          }

          schema {
            query: Query
          }
        `,
        resolvers: {
          Query: {
            author() {}
          }
        }
      }))

      const query = parse(`
        {
          author (id: 1) {
            id
            firstName
            posts
          }
        }
      `)

      assert.deepEqual(graphQl.createQueryStructureWithRelations(query), [{
        name: 'Author',
        fieldName: 'author',
        fields: {
          posts: {
            name: 'Post',
            fieldName: 'posts',
            fields: {}
          }
        }
      }])
    })
  })
  describe('normalize', () => {
    it('should normalize simple query', () => {
      const graphQl = new GraphQl(createExecutableSchema({
        schema: `
          type Author {
            id: ID!
            firstName: String
          }

          type Query {
            author: Author
          }

          schema {
            query: Query
          }
        `,
        resolvers: {
          Query: {
            author() {}
          }
        }
      }))

      const query = `
        {
          author (id: 1) {
            id
            firstName
          }
        }
      `
      graphQl.addQuery(query)

      assert.deepEqual(graphQl.normalize(query, {
        author: {
          id: 1,
          firstName: 'woop'
        }
      }), {
        objectIds: {
          author: 1
        },
        entities: {
          Author: {
            1: {
              id: 1,
              firstName: 'woop'
            }
          }
        }
      })
    })
    it('should normalize relational query', () => {
      const graphQl = new GraphQl(createExecutableSchema({
        schema: `
          type Author {
            id: ID!
            firstName: String
            posts: [Post]
          }

          type Post {
            id: ID!
            title: String
          }

          type Query {
            author: Author
          }

          schema {
            query: Query
          }
        `,
        resolvers: {
          Query: {
            author() {}
          }
        }
      }))

      const query = `
        {
          author (id: 1) {
            id
            firstName
            posts
          }
        }
      `

      graphQl.addQuery(query)

      assert.deepEqual(graphQl.normalize(query, {
        author: {
          id: 1,
          firstName: 'woop',
          posts: [{
            id: 1,
            title: 'hm'
          }]
        }
      }), {
        objectIds: {
          author: 1
        },
        entities: {
          Author: {
            1: {
              id: 1,
              firstName: 'woop',
              posts: [1]
            }
          },
          Post: {
            1: {
              id: 1,
              title: 'hm'
            }
          }
        }
      })
    })
    it('should normalize query with no arguments', () => {
      const graphQl = new GraphQl(createExecutableSchema({
        schema: `
          type User {
            id: ID!
            name: String
          }

          type Query {
            me: User
          }

          schema {
            query: Query
          }
        `,
        resolvers: {
          Query: {
            me() {}
          }
        }
      }))

      const query = `
        {
          me {
            name
          }
        }
      `

      graphQl.addQuery(query)

      assert.deepEqual(graphQl.normalize(query, {
        me: {
          id: 1,
          name: 'woop'
        }
      }), {
        objectIds: {
          me: 1
        },
        entities: {
          User: {
            1: {
              id: 1,
              name: 'woop'
            }
          }
        }
      })
    })
  })
})
