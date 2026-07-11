import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      id
      name
      born
      bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      id
      title
      published
      author {
        name,
        born
      }
    }
  }
`

export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $published: Int!, $author: String!, $genres: [String]!) {
    addBook(title: $title, published: $published, author: $author, genres: $genres) {
      id
      title
      published
      author
      genres
    }
  }
`

export const EDIT_AUTHOR_BIRTH_YEAR = gql`
  mutation editAuthorBirthYear($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      id
      name
      born
      bookCount
    }
  }
`
