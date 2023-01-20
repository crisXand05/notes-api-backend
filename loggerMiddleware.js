// midleware
const logger = (request, response, next) => {
  console.log(request.body)
  console.log(request.path)
  console.log(request.method)
  next()
}

module.exports = logger
