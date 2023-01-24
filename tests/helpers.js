const supertest = require('supertest')
const { app } = require('../index')
const api = supertest(app)

const initialNotes = [
  {
    content: 'Javascript es un lenguaje de programacion interpretado',
    date: '2023-01-17T20:21:48.916Z',
    important: true,
    id: '63c7035ceedf9a95a71d768a'
  },
  {
    content: 'Instalar eslinter standar en todos los proyectos como dependencia de desarrollo',
    date: '2023-01-18T00:16:59.860Z',
    important: true,
    id: '63c73a7be5743071578de7ec'
  },
  {
    content: 'Hola buenas tardes',
    date: '2023-01-18T00:44:53.068Z',
    important: false,
    id: '63c74105515f345a3dbbd4f1'
  }
]
const getAllContentNotes = async () => {
  const response = await api.get('/api/note')
  const content = response.body.map(note => note.content)
  return {
    response,
    content
  }
}
module.exports = { api, initialNotes, getAllContentNotes }
