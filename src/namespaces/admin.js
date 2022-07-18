module.exports = (io) => {
  io.of('/admin').use((socket, next) => {
    if (socket.handshake.auth === undefined || socket.handshake.auth.token === undefined) {
      next(new Error('Auth token missing'))
      return
    }

    if (!(typeof socket.handshake.auth.token === 'string')) {
      next(new Error('Auth token invalid'))
      return
    }

    next()
  })

  io.of('/admin').on('connection', async (socket) => {
    socket.join(socket.handshake.auth.token)
  })
}
