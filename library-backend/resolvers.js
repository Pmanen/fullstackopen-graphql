const { GraphQLError } = require('graphql')
const { v4: uuid } = require('uuid')
const Author = require('./models/author')
const Book = require('./models/book')

const resolvers = {
  Query: {
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
    addBook: async (root, args) => {
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
    editAuthor: async (root, { name, setBornTo }) => {
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
