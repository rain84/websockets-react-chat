export type Message = {
  id: string
  message: string
}

export type DataType = 'connection' | 'message'

export type Data<T = unknown> = {
  type: DataType
  data: T
}

export type ConnectionData = Data<{
  id: string
}>

export type MessageData = Data<Message>
