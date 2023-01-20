const mongoose = require('mongoose')

const { MONGO_DB_URI, MONGO_DB_URI_TEST, NODE_ENV } = process.env

const connectionString = NODE_ENV === 'test' ? MONGO_DB_URI_TEST : MONGO_DB_URI

mongoose.set('strictQuery', true)
mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Conexion exitosa'))
  .catch(err => console.log('error', err))

process.on('uncaughtException', () => {
  mongoose.connection.close()
})
