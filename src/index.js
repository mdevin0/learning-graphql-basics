import {GraphQLServer} from 'graphql-yoga'


// Type definitions (schema)
const typeDefs = `
  type Query {
    user: User!
    post: Post!
  }

  type User{
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post{
    id: ID!
    title: String!
    content: String!
    published: Boolean!
  }
`

// Resolvers
const resolvers = {
  Query: {
    user(){
      return {
        id: '1',
        name: 'Root',
        email: 'root@linux.com'
      }
    },
    post(){
      return {
        id: '1',
        title: 'How to execute any command you want',
        content: 'Just add the word "sudo" before it',
        published: true
      }
    }
  } // Query
} // resolvers

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log('Ready to serve.')
})