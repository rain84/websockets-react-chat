const http = require('http')
const PORT = 8000
const { log } = console

const httpServer = http.createServer().listen(PORT, () => {
  log(`Listening on port ${PORT}`)
})

const websocketServer = require('websocket').server
const wsServer = new websocketServer({ httpServer })
const users = new Map()

wsServer.on('request', (request) => {
  log(`Connection request from ${request.origin}`)

  const id = generateID()
  const connection = request.accept(null, request.origin)

  users.set(id, connection)
  connection.sendUTF(createString('connection', { id }))
  connection.on('message', onMessage)
  connection.on('close', onClose(id))
})

const onMessage = (message) => {
  if (message.type !== 'utf8') return

  try {
    const data = JSON.parse(message.utf8Data)
    log(`Received message ${data.message} from ${data.id}`)

    for (const [user, connection] of users) {
      if (user === data.id) continue
      connection.sendUTF(createString('message', { id: user, message: data.message }))
    }
  } catch (error) {
    log(error)
  }
}

const onClose = (id) => () => {
  users.delete(id)
  log(`Closed connection ${id}`)
}

function generateID() {
  return 'id-' + Math.random().toString(16).slice(2)
}

/** {@param type: connection, message} */
const createString = (type, data) => JSON.stringify({ type, data })
