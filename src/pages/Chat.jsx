import { useParams } from 'react-router-dom'
import ChatLayout from '../components/Chats/ChatLayout'

function Chat() {
  const { roomId } = useParams()
  return <ChatLayout roomId={roomId} />
}

export default Chat
