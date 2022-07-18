const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const app = express()
const createHttpRoutes = require('./routes')
const createAdminNamespace = require('./namespaces/admin.js')
const { createClient } = require('redis')
const { createAdapter } = require('@socket.io/redis-adapter')
const gracefulShutdown = require('http-graceful-shutdown')
const httpServer = http.createServer(app)
const port = process.env.PORT || 3000
const redisHost = process.env.REDIS_HOST || '127.0.0.1'
const redisPort = process.env.REDIS_PORT || 6379

// This ensures the request IP matches the client and not the load-balancer.
app.enable('trust proxy')
app.use(express.json())

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
  },
})

// HTTP Routes
createHttpRoutes(app, io)

// Admin namespace
createAdminNamespace(io)

// Handling multiple nodes: https://socket.io/docs/v4/using-multiple-nodes/
const pubClient = createClient({ url: `redis://${redisHost}:${redisPort}` })
const subClient = pubClient.duplicate()

Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  io.adapter(createAdapter(pubClient, subClient))
  httpServer.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`)
  })
})

// Handle SIGINT or SIGTERM and drain connections.
gracefulShutdown(httpServer)
