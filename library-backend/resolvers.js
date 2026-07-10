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
      await book.save()
      return book.populate('author');
    },
    editAuthor: async (root, { name, setBornTo }) => {
      const author = await Author.findOne({ name })
      if (!author) return null
      author.born = setBornTo
      await author.save()
      return author;
    },
  },
};

module.exports = resolvers
