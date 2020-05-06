import {GraphQLServer} from 'graphql-yoga'
import {v4 as uuidv4} from 'uuid'

// Demo data
let users = [{
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

let posts = [{
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

let comments = [{
  id: '1',
  text: 'This is a comment!',
  author: '1',
  post: '1'
},{
  id: '2',
  text: 'This is another comment!',
  author: '2',
  post: '3'
},{
  id: '3',
  text: 'This is one more comment!',
  author: '2',
  post: '3'
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

  type Mutation {
    createUser (data: UserInput!): User!
    deleteUser (id: ID!): User!
    createPost (data: PostInput!): Post!
    deletePost (id: ID!): Post!
    createComment (data: CommentInput!): Comment!
    deleteComment (id: ID!): Comment!
  }

  input UserInput {
    name: String!
    email: String!
    age: Int
  }

  input PostInput {
    title: String!
    content: String!
    isPublished: Boolean!
    author: ID!
  }

  input CommentInput {
    text: String!
    post: ID!
    author: ID!
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

  Mutation: {
    createUser(parent, args, ctx, info){
      const isEmailTaken = users.some((user) => user.email === args.data.email)
      if(isEmailTaken){
        throw new Error('E-mail is already taken.')
      }

      const user = {
        id: uuidv4(),
        ...args.data
      }
      users.push(user)
      return user
    },

    deleteUser(parent, args, ctx, info){
      const userIndex = users.findIndex((user) => user.id === args.id)
      if(userIndex === -1){
        throw new Error('User not found.')
      }

      comments = comments.filter((comment) => comment.author !== args.id)
      posts = posts.filter((post) => {
        const match = post.author === args.id
        
        if(match){
          comments = comments.filter((comment) => comment.post !== post.id)
        }
        
        return !match
      })
      const user = users.splice(userIndex, 1)[0]



      return user
    },

    createPost(parent, args, ctx, info){
      const userExists = users.some((user) => user.id === args.data.author)
      if(!userExists){
        throw new Error('User not found.')
      }

      const post = {
        id: uuidv4(),
        ...args.data
      }
      posts.push(post)
      return post
    },

    deletePost(parent, args, ctx, info){
      const postIndex = posts.findIndex((post) => post.id === args.id)
      if(postIndex === -1){
        return new Error("Post not found.")
      }

      const post = posts.splice(postIndex, 1)[0]
      comments = comments.filter((comment) => comment.post !== args.id)

      return post
    },

    createComment(parent, args, ctx, info){
      const userExists = users.some((user) => user.id === args.data.author)
      const postExists = posts.some((post) => post.id === args.data.post && post.isPublished)

      if(!userExists || !postExists){
        throw new Error('User or published post not found.')
      }

      const comment = {
        id: uuidv4(),
        ...args.data
      }
      comments.push(comment)
      return comment
    },

    deleteComment(parent, args, ctx, info){
      const commentIndex = comments.findIndex((comment) => comment.id === args.id)
      if(commentIndex === -1){
        throw new Error("Comment not found.")
      }

      return comments.splice(commentIndex, 1)[0]

    }
  }, // Mutation

  User: {
    posts(parent, args, ctx, info){
      return posts.filter((post) => post.author === parent.id)
    },
    comments(parent, args, ctx, info){
      return comments.filter((comment) => comment.author === parent.id)
    }
  }, // User

  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author)
    },
    comments(parent, args, ctx, info){
      return comments.filter((comment) => comment.post === parent.id)
    }
  }, // Post

  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.author)
    },
    post(parent, args, ctx, info){
      return posts.find((post) => post.id === parent.post)
    }
  } // Comment
} // resolvers

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log('Ready to serve! o7')
})