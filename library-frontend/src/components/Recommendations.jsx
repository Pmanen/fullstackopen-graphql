import { useState } from 'react'
import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ME } from '../queries'

const Recommendations = (props) => {
  const books = useQuery(ALL_BOOKS)
  const user = useQuery(ME)

  if (!props.show) {
    return null
  }

  if (books.loading || user.loading) {
    return <div>loading...</div>
  }

  const favoriteGenre = user.data.me.favoriteGenre
  const favoriteBooks = books.data.allBooks.filter((book) => book.genres.includes(favoriteGenre))

  return (
    <div>
      <h2>recommendations</h2>

      {favoriteBooks ?
        <div>books in your favorite genre "{favoriteGenre}"</div> :
        <div>add a favorite genre to get recommendations</div>
      }

      <table>
          <tbody>
            <tr>
              <th></th>
              <th>author</th>
              <th>published</th>
            </tr>
            {favoriteBooks.map((a) => (
              <tr key={a.id}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
  )
}

export default Recommendations
