// const http = require('http')
// const { response } = require('express')
const express = require('express')
const app = express()
const logger = require('./loggerMiddleware')
const cors = require('cors')

app.use(cors())
app.use(express.json())

app.use(logger)

const hostname = '127.0.0.1'
const port = process.env.PORT || 3001

let notas = [
  {
    id: 1,
    content: 'delectus aut autem',
    date: new Date().toISOString,
    important: false
  },
  {
    id: 2,
    content: 'Realizar un clone de duolingo',
    date: new Date().toISOString,
    important: true
  },
  {
    id: 3,
    content: 'Realizar un clone de tiktok',
    date: new Date().toISOString,
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>hello wordl</h1>')
})

app.get('/api/note', (request, response) => {
  response.json(notas)
})
app.get('/api/note/:id', (request, response) => {
  const id = Number(request.params.id)
  const note = notas.find(note => note.id === id)
  if (note) {
    response.json(note)
  } else response.status(404).end()
})
app.delete('/api/note/:id', (request, response) => {
  const id = Number(request.params.id)
  notas = notas.filter(nota => nota.id !== id)
  response.status(204).end()
})

app.post('/api/note', (request, response) => {
  const note = request.body
  console.log(note)
  const ids = notas.map(el => el.id)
  const maxId = Math.max(...ids)
  const newNote = {
    id: maxId + 1,
    content: note.content,
    date: new Date().toISOString,
    important: note.completed === undefined ? false : note.important
  }

  notas = [...notas, newNote]
  response.json(newNote)
})

app.use((request, response) => {
  response.status(404).json({
    error: 'Not found'
  })
})

app.listen(port, () => {
  console.log(`Server executing in http://${hostname}:${port}/`)
})
