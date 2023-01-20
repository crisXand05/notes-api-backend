require('dotenv').config()
require('./mongo.js')
const Note = require('./models/Note.js')
const express = require('express')
const app = express()
const logger = require('./loggerMiddleware')
const cors = require('cors')
const notFound = require('./middleware/notFound.js')
const handleErrors = require('./middleware/handleErrors.js')

app.use(cors())
app.use(express.json())
app.use(logger)

const hostname = '127.0.0.1'
const port = process.env.PORT

app.get('/', (request, response) => {
  response.send('<h1>hello world</h1>')
})

app.get('/api/note', (request, response) => {
  Note.find({}).then(resp => response.json(resp))
})

app.get('/api/note/:id', (request, response, next) => {
  const id = request.params.id

  Note.findById(id).then(note => {
    if (note) response.json(note)
    else response.status(404).end()
  }).catch(error => {
    next(error)
  })
})

app.delete('/api/note/:id', (request, response, next) => {
  const id = request.params.id
  Note.findByIdAndRemove(id)
    .then(result => response.status(204).end())
    .catch(err => next(err))
})

app.put('/api/note/:id', (request, response, next) => {
  const id = request.params.id
  const note = request.body
  const newNoteInfo = {
    content: note.content,
    important: note.important === undefined ? false : note.important
  }
  Note.findByIdAndUpdate(id, newNoteInfo, { new: true })
    .then(result => response.json(result))
    .catch(err => next(err))
})

app.post('/api/note', (request, response) => {
  const note = request.body
  if (!note.content) {
    return response.status(400).json({
      error: 'Required content field is missing'
    })
  }
  const newNote = new Note({
    content: note.content,
    date: new Date(),
    important: note.important === undefined ? false : note.important
  })

  newNote.save().then(resp => response.json(resp))
})
app.use(notFound)

app.use(handleErrors)

const server = app.listen(port, () => {
  console.log(`Server executing in http://${hostname}:${port}/`)
})

module.exports = { app, server }
