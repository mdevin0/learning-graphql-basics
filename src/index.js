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
  isPublished: true,
  author: '1'
},{
  id: '2',
  title: 'Spider-man',
  content: 'The amazing Spider-Man!',
  isPublished: false,
  author: '1'
},{
  id: '3',
  title: 'No idea',
  content: 'I ran out of ideas.',
  isPublished: true,
  author: '2'
}]

const comments = [{
  id: '1',
  text: 'This is a comment!',
  author: '1',
  post: '1'
},{
  id: '2',
  text: 'This is another comment!',
  author: '1',
  post: '3'
},{
  id: '3',
  text: 'This is one more comment!',
  author: '2',
  post: '1'
},{
  id: '4',
  text: 'Last comment!',
  author: '3',
  post: '2'
}]


// Type definitions (schema)
const typeDefs = `
  type Query {
    user: User!
    users(query: String): [User]!
    post: Post!
    posts(query: String): [Post]!
    comments: [Comment]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post]!
    comments: [Comment]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    isPublished: Boolean!
    author: User!
    comments: [Comment]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
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
    users(parent, args, ctx, info){
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
    posts(parent, args, ctx, info){
      if(!args.query){
        return posts
      }

      return posts.filter((post) => {
        return post.title.toLowerCase().includes(args.query.toLowerCase()) 
            || post.content.toLowerCase().includes(args.query.toLowerCase())
      })

    },
    comments(parent, args, ctx, info){
      return comments
    }
  }, // Query

  User: {
    posts(parent, args, ctx, info){
      return posts.filter((post) => post.author === parent.id)
    },
    comments(parent, args, ctx, info){
      return comments.filter((comment) => comment.author === parent.id)
    }
  },

  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author)
    },
    comments(parent, args, ctx, info){
      return comments.filter((comment) => comment.post === parent.id)
    }
  },

  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author)
    },
    post(parent, args, ctx, info){
      return posts.find((post) => post.id === parent.post)
    }
  }
} // resolvers

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log('Ready to serve! o7')
})