const { GraphQLError } = require('graphql')
const { v4: uuid } = require('uuid')
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const resolvers = {
  Query: {
    me: (root, args, { currentUser }) => currentUser,
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, { author, genre }) => {
      const filter = {}
      if (author) {
        const foundAuthor = await Author.findOne({ name: author })
        if (!foundAuthor) return []
        filter.author = foundAuthor._id
      }
      if (genre) filter.genres = genre
      return Book.find(filter).populate('author')
    },
    allAuthors: async () => Author.find({}),
  },
  Author: {
    bookCount: (author) =>
      // books.filter((book) => book.author === author.name).length,
      1
  },
  Mutation: {
    createUser: async (root, args) => {
      const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

      return user.save()
        .catch(error => {
          throw new GraphQLError(`Creating user failed: ${error.message}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: args,
              error
            },
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError(`wrong credentials`, {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('User not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }
      const author = await Author.findOne({ name: args.author }) ||
        await new Author({ name: args.author}).save()
      const book = new Book({ ...args, id: uuid(), author })
      try {
        await book.save()
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args,
            error
          },
        })
      }
      return book.populate('author');
    },
    editAuthor: async (root, { name, setBornTo }, { currentUser }) => {
      if (!currentUser) {
        throw new GraphQLError('User not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED',
          },
        })
      }
      const author = await Author.findOne({ name })
      if (!author) {
        throw new GraphQLError(`Author ${name} not found`, {
          extensions: {
            code: 'NOT_FOUND',
            invalidArgs: { name },
          },
        })
      }
      author.born = setBornTo
      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: { setBornTo },
            error
          },
        })
      }
      return author;
    },
  },
};

module.exports = resolvers
