const { auth } = require('./middlewares')

module.exports = (app, io) => {
  // "Emit" endpoint for broadcast http request.
  app.post('/emit', auth, (req, res) => {
    const event = req.body.event
    const namespace = req.body.namespace
    const data = req.body.data

    if (event === undefined || !(typeof event === 'string')) {
      res.statusCode = 401
      return res.json({ message: 'Event name missing.' })
    }

    if (namespace === undefined || !(typeof namespace === 'string')) {
      res.statusCode = 401
      return res.json({ message: 'Namespace missing.' })
    }

    if (data === undefined) {
      res.statusCode = 401
      return res.json({ message: 'Data missing.' })
    }

    io.of(namespace).emit(event, data)
    res.send()
  })

  // Health check endpoint
  app.get('/healthcheck', (req, res) => res.send())

  // Disable any other path.
  app.get('/*', (req, res) => {
    res.statusCode = 404
    res.send()
  })
}
