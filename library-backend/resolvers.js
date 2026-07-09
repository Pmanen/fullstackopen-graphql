const { GraphQLError } = require('graphql')
const { v4: uuid } = require('uuid')
const Author = require('./models/author')
const Book = require('./models/book')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      // let return_val = books;
      // if (args.author)
      //   return_val = return_val.filter((book) => book.author === args.author);
      // if (args.genre)
      //   return_val = return_val.filter((book) =>
      //     book.genres.includes(args.genre),
      //   );
      return Book.find({});
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
      return book;
    },
    editAuthor(root, { name, setBornTo }) {
      // const author = authors.find((author) => author.name === name);
      // if (!author) return null;
      // const updatedAuthor = { ...author, born: setBornTo };
      // authors = authors.map((author) =>
      //   author.name === name ? updatedAuthor : author,
      // );
      // return updatedAuthor;
    },
  },
};

module.exports = resolvers
