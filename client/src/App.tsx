import { useEffect, useRef, useState } from 'react'
import './App.css'
import { ConnectionData, Data, MessageData, type Message } from './types'

const socket = new WebSocket('ws://localhost:8000')
const { log } = console

function App() {
  const [messages, setMessages] = useState<string[]>([])
  const [id, setId] = useState<string>('')
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    socket.addEventListener(`message`, onMessage)
    return () => socket.removeEventListener('message', onMessage)
  }, [])

  const onMessage = (event: MessageEvent): void => {
    try {
      const data = JSON.parse(event.data) as Data

      switch (data.type) {
        case 'connection':
          setId((data as ConnectionData).data.id)
          break

        case 'message':
          setMessages((prev) => [...prev, (data as MessageData).data.message])
          break

        default:
          break
      }
    } catch (error) {
      log(error)
    }
  }

  const onClick = () => {
    if (!input.current) return

    const message = input.current.value
    const data: Message = { id, message }

    setMessages((prev) => [...prev, message])
    socket.send(JSON.stringify(data))
  }

  return (
    <>
      <h1>WebSocket chat</h1>
      <div>
        <input id="message" type="text" ref={input} />
        <button onClick={onClick}>Send</button>
        <ul id="messages">
          {messages.map((message, index) => (
            <li key={index}>{message}</li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default App
