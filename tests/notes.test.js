const mongoose = require('mongoose')
const { server } = require('../index')
const Note = require('../models/Note')
const { api, initialNotes, getAllContentNotes } = require('./helpers')

beforeEach(async () => {
  await Note.deleteMany({})

  for (const note of initialNotes) {
    const noteObject = new Note(note)
    await noteObject.save()
  }
})
describe('Get notes', () => {
  test('Notes are returned as json', async () => {
    await api
      .get('/api/note')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('There are three notes', async () => {
    const response = await api.get('/api/note')
    expect(response.body).toHaveLength(initialNotes.length)
  })

  test('the firs note is about js', async () => {
    const { content } = await getAllContentNotes()
    expect(content).toContain('Javascript es un lenguaje de programacion interpretado')
  })
})

describe('Add notes', () => {
  test('A note can be added', async () => {
    const newNote = {
      content: 'New note for test',
      date: new Date(),
      important: false
    }
    await api.post('/api/note')
      .send(newNote)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const { content, response } = await getAllContentNotes()

    expect(content).toContain(newNote.content)
    expect(response.body).toHaveLength(initialNotes.length + 1)
  })

  test('note without content is not added', async () => {
    const newNote = {
      date: new Date(),
      important: false
    }
    await api.post('/api/note')
      .send(newNote)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/note')

    expect(response.body).toHaveLength(initialNotes.length)
  })
})

describe('Delete notes', () => {
  test('note has deleted', async () => {
    const { response } = await getAllContentNotes()
    const noteToDelete = response.body[0]
    await api
      .delete(`/api/note/${noteToDelete.id}`)
      .expect(204)

    const { content } = await getAllContentNotes()

    expect(content).toHaveLength(initialNotes.length - 1)

    expect(content).not.toContain(noteToDelete.content)
  })

  test('a note than dont exits can not be deleted', async () => {
    const { response } = await getAllContentNotes()
    const noteToDelete = response.body[0]
    await api
      .delete('/api/note/123')
      .expect(400)

    const { content } = await getAllContentNotes()

    expect(content).toHaveLength(initialNotes.length)

    expect(content).toContain(noteToDelete.content)
  })
})

describe('Update notes', () => {
  test('update note number 3', async () => {
    const newNote = {
      content: 'nota actualizada',
      important: false
    }
    const { response } = await getAllContentNotes()
    const noteObject = response.body[2]
    const noteUpdated = await api.put(`/api/note/${noteObject.id}`)
      .send(newNote)
      .expect(200)
    expect(noteUpdated.body.content).toContain(newNote.content)
  })
})

afterAll(() => {
  mongoose.connection.close()
  server.close()
})
