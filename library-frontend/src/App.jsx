import { useState } from 'react'
import { useApolloClient } from '@apollo/client/react'
import LoginForm from './components/LoginForm'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'

const App = () => {
  const client = useApolloClient()
  const [page, setPage] = useState('authors')
  const [error, setError] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('library-user-token'))

  const onLogout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage('authors')
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token && <button onClick={() => setPage('add')}>add book</button>}
        {token ? <button onClick={onLogout}>logout</button> : <button onClick={() => setPage('login')}>login</button>}
      </div>

      <Authors show={page === 'authors'} token={token} />

      <Books show={page === 'books'} />

      <NewBook show={page === 'add'} />

      <LoginForm show={page === 'login'} setError={setError} setToken={setToken} setPage={setPage} />
    </div>
  )
}

export default App
