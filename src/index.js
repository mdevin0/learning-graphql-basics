import {GraphQLServer} from 'graphql-yoga'

// Demo data
const users = [{
  id: '1',
  name: 'Me',
  email: 'me@here.com',
  age: 30
},{
  id: '2',
  name: 'You',
  email: 'you@here.com',
  age: 45
},{
  id: '3',
  name: 'Us',
  email: 'us@here.com',
}]
const posts = [{
  id: '1',
  title: 'Amazingly amazing',
  content: 'This post is amazing!',
  published: true
},{
  id: '2',
  title: 'Spider-man',
  content: 'The amazing Spider-Man!',
  published: false
},{
  id: '3',
  title: 'No idea',
  content: 'I ran out of ideas.',
  published: true
}]

// Type definitions (schema)
const typeDefs = `
  type Query {
    user: User!
    users(query: String): [User]!
    post: Post!
    posts(query: String): [Post]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
  }

  type Post {
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
    users(parent, args, context, info){
      if(!args.query){
        return users
      } else {
        return users.filter((user) => {
          return user.name.toLowerCase().includes(args.query.toLowerCase())
        })
      }
    },
    post(){
      return {
        id: '1',
        title: 'How to execute any command you want',
        content: 'Just add the word "sudo" before it',
        published: true
      }
    },
    posts(parent, args, context, info){
      if(!args.query){
        return posts
      }

      return posts.filter((post) => {
        return post.title.toLowerCase().includes(args.query.toLowerCase()) 
            || post.content.toLowerCase().includes(args.query.toLowerCase())
      })

    }
  } // Query
} // resolvers

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log('Ready to serve! o7')
})