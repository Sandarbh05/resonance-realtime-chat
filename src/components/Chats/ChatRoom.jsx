import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import service from '../../appwrite/config'

function ChatRoom({ roomId }) {
  const user = useSelector(state => state.auth.userData)

  const [room, setRoom] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [showAddUser, setShowAddUser] = useState(false)

  // 🔹 Members
  const [members, setMembers] = useState([])
  const [memberMap, setMemberMap] = useState({})

  // 🔹 senderId -> name cache
  const [senderMap, setSenderMap] = useState({})

  /* -------------------- LOAD ROOM -------------------- */
  useEffect(() => {
    if (!roomId) return
    service.getRoom(roomId).then(setRoom)
  }, [roomId])

  /* -------------------- LOAD MESSAGES -------------------- */
  useEffect(() => {
    if (!roomId) return
    service.getRoomMessages(roomId).then(setMessages)
  }, [roomId])

  /* -------------------- REALTIME MESSAGES -------------------- */
  useEffect(() => {
    if (!roomId) return

    const unsubscribe = service.subscribeToRoomMessages(roomId, event => {
      const msg = event.payload

      setMessages(prev => {
        if (prev.some(m => m.$id === msg.$id)) return prev
        return [...prev, msg]
      })
    })

    return () => unsubscribe()
  }, [roomId])

  /* -------------------- LOAD GROUP MEMBERS -------------------- */
  useEffect(() => {
    if (!room?.isGroup) return

    const loadMembers = async () => {
      const ids = await service.getRoomMembers(roomId)
      const map = {}

      for (const id of ids) {
        const profile = await service.getUserProfile(id)
        if (profile) map[id] = profile.name
      }

      setMembers(ids)
      setMemberMap(map)
    }

    loadMembers()
  }, [room])

  /* -------------------- RESOLVE SENDER NAMES -------------------- */
  useEffect(() => {
    if (!room?.isGroup || messages.length === 0) return

    const map = { ...senderMap }

    const loadSenders = async () => {
      for (const msg of messages) {
        if (!map[msg.senderId]) {
          const profile = await service.getUserProfile(msg.senderId)
          if (profile) map[msg.senderId] = profile.name
        }
      }
      setSenderMap(map)
    }

    loadSenders()
  }, [messages, room])

  /* -------------------- ADMIN CHECK -------------------- */
  const isAdmin =
    room?.isGroup && room?.admins?.includes(user.$id)

  /* -------------------- SEND MESSAGE -------------------- */
  const handleSend = async () => {
    if (!text.trim()) return

    await service.sendMessage({
      roomId,
      senderId: user.$id,
      text,
      attachments: ''
    })

    setText('')
  }

  return (
    <div className="h-[84vh] w-8/12 flex flex-col border-r">

      {/* ---------- GROUP HEADER ---------- */}
      {room?.isGroup && (
        <div className="border-b p-2 space-y-2">

          {/* Members list */}
          <div className="p-2 text-md text-white bg-[#2BB5DF]">
            <span className="font-semibold">Members:</span>{' '}
            {members.map(id => (
              <span key={id} className="mr-2">
                {memberMap[id] || id}
                {room.admins?.includes(id) && ' 👑'}
                {id === user.$id && ' (You)'}
              </span>
            ))}
          </div>

          {/* Add member (ADMIN ONLY) */}
          {isAdmin && (
            <>
              <button
                onClick={() => setShowAddUser(p => !p)}
                className="text-xs px-2 py-1 border rounded sticky"
              >
                + Add Member
              </button>

              {showAddUser && (
                <input
                  placeholder="Enter userId"
                  className="border px-2 py-1 rounded text-sm w-full"
                  onKeyDown={async e => {
                    if (e.key === 'Enter') {
                      const targetUserId = e.target.value.trim()
                      if (!targetUserId) return

                      await service.addUserToRoom({
                        roomId,
                        userId: targetUserId
                      })

                      setShowAddUser(false)
                      e.target.value = ''
                    }
                  }}
                />
              )}
            </>
          )}
        </div>
      )}

      {/* ---------- MESSAGES ---------- */}
      <div className="flex-1 p-4 overflow-y-auto space-y-2">
        {messages.map(msg => {
          const isMe = msg.senderId === user.$id

          return (
            <div
              key={msg.$id}
              className={`max-w-md space-y-2 rounded ${
                isMe
                  ? 'ml-auto bg-blue-500 text-white'
                  : 'bg-[#2CBC46]'
              }`}
            >
              {/* Sender name for group */}
              {room?.isGroup && !isMe && (
                <div className="p-1 text-md font-semibold text-black mb-1 border-none rounded-t-lg bg-[#DBDBDB]">
                  {senderMap[msg.senderId] || 'Loading...'}
                </div>
              )}

              <div className="p-2 text-md">{msg.text}</div>
            </div>
          )
        })}
      </div>

      {/* ---------- INPUT ---------- */}
      <div className="p-1 border-t flex gap-2 w-full">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          className="flex-1 border rounded px-3 py-1"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="px-4 py-0.5 bg-white rounded text-[#878686] absolute bottom-[3vh] right-[27vw]"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default ChatRoom
