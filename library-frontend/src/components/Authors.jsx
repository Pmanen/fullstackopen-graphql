import { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client/react'
import { ALL_AUTHORS, EDIT_AUTHOR_BIRTH_YEAR } from '../queries'

const Authors = (props) => {
  const authors = useQuery(ALL_AUTHORS)
  if (!props.show) {
    return null
  }

  if (authors.loading) {
    return <div>loading...</div>
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.data.allAuthors.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {props.token && <BirthyearForm allAuthors={authors.data.allAuthors} />}
    </div>
  )
}

const BirthyearForm = ({ allAuthors }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [editAuthorBirthYear] = useMutation(EDIT_AUTHOR_BIRTH_YEAR, {
    onCompleted: (data) => {
      if (!data.editAuthor) {
        console.log('ERROR: author not found')
      }
    }
  })

  const submit = (event) => {
    event.preventDefault()

    editAuthorBirthYear({ variables: { name, born } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>Set birthyear</h2>
      <form onSubmit={submit}>
        <div>
          <label>name:</label>
          <select name="name" onChange={({ target }) => setName(target.value)} >
            {allAuthors.map((a) => {
              return (<option key={a.id} value={a.name}>{a.name}</option>)
            })}
          </select>
        </div>
        <div>
          <label>born:</label>
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default Authors
