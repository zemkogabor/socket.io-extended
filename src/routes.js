const { authClient } = require('./middlewares')

module.exports = (app, io) => {
  // "Emit" endpoint for broadcast http request.
  app.post('/emit', authClient, (req, res) => {
    const event = req.body.event
    const namespace = req.body.namespace
    const room = req.body.room
    const data = req.body.data

    if (event === undefined || !(typeof event === 'string')) {
      res.statusCode = 400
      return res.json({ message: 'Event name missing.' })
    }

    if (namespace !== undefined && !(typeof namespace === 'string')) {
      res.statusCode = 400
      return res.json({ message: 'Invalid namespace.' })
    }

    if (room !== undefined && !(typeof room === 'string') && !(typeof room === 'number')) {
      res.statusCode = 400
      return res.json({ message: 'Invalid room.' })
    }

    if (data === undefined) {
      res.statusCode = 400
      return res.json({ message: 'Data missing.' })
    }

    let _io = io

    if (namespace !== undefined) {
      _io = _io.of(namespace)
    }

    if (room !== undefined) {
      _io = _io.to(room)
    }

    _io.emit(event, data)

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
