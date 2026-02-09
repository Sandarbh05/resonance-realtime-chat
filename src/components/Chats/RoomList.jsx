import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import service from '../../appwrite/config'

function RoomList() {
  const user = useSelector(state => state.auth.userData)
  const [rooms, setRooms] = useState([])
  const [userMap, setUserMap] = useState({})
  const [showNewChat, setShowNewChat] = useState(false)
  const [chatMode, setChatMode] = useState(null) // 'dm' | 'group'
  const navigate = useNavigate()

  // 1️⃣ Fetch rooms for current user
  useEffect(() => {
    if (!user) return
    service.getUserRooms(user.$id).then(setRooms)
  }, [user])

  // 2️⃣ Subscribe to room changes (realtime update)
  useEffect(() => {
    if (!user) return

    const unsubscribe = service.subscribeToUserRooms(
      user.$id,
      () => {
        service.getUserRooms(user.$id).then(setRooms)
      }
    )

    return () => unsubscribe()
  }, [user])

  // 3️⃣ Resolve usernames for DM rooms
  useEffect(() => {
    if (!user || rooms.length === 0) return

    const loadNames = async () => {
      const map = {}

      for (const room of rooms) {
        if (!room.isGroup) {
          const otherUserId = room.members.find(id => id !== user.$id)
          if (!otherUserId) continue

          const profile = await service.getUserProfile(otherUserId)
          if (profile) {
            map[room.$id] = profile.name
          }
        }
      }

      setUserMap(map)
    }

    loadNames()
  }, [rooms, user])

  return (
    <div className="px-4">

      {/* 🔹 SHOW USER ID */}
      {user && (
        <div className="absolute top-[5vh] left-1/2 -translate-x-1/2 p-2 bg-transparent text-lg flex items-center justify-between border-2 border-[#F8F8F8]" style={{font: "Seoge UI"}}>
          <div className="truncate">
            <span className="font-semibold">Your User ID:</span>{' '}
            <span className="select-all">{user.$id}</span>
          </div>

          <button
            className="ml-2 text-[#878686] bg-white rounded-[8px] px-1 py-0.5 hover:underline"
            onClick={() => navigator.clipboard.writeText(user.$id)}
          >
            copy
          </button>
        </div>
      )}

      {/* Header */}
      <h2 className="font-semibold mb-3 text-3xl" style={{font: "Seoge UI"}}>Rooms</h2>

      {/* New Chat Button */}
      <button
        onClick={() => {
          setShowNewChat(prev => !prev)
          setChatMode(null)
        }}
        className="w-full mb-3 px-3 py-2 bg-transparent text-white rounded text-2xl border-2 border-white"
        style={{font: "Seoge UI"}}
      >
        + New Chat
      </button>

      {/* Create Chat Panel */}
      {showNewChat && (
        <div className="mb-3 space-y-2 border-2 border-white" style={{font: "Seoge UI"}}>

          {!chatMode && (
            <>
              <button
                onClick={() => setChatMode('dm')}
                className="w-full py-1 bg-[#2F2F2F] text-white text-2xl"
              >
                Direct Message
              </button>

              <button
                onClick={() => setChatMode('group')}
                className="w-full py-1 bg-[#2F2F2F] text-white text-2xl"
              >
                Create Group
              </button>
            </>
          )}

          {/* DM */}
          {chatMode === 'dm' && (
            <input
              placeholder="Enter userId"
              className="w-full border px-2 py-1 rounded"
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  const targetUserId = e.target.value.trim()
                  if (!targetUserId) return

                  const room = await service.createPrivateRoom(
                    user.$id,
                    targetUserId
                  )

                  setShowNewChat(false)
                  setChatMode(null)
                  navigate(`/chat/${room.$id}`)
                }
              }}
            />
          )}

          {/* Group */}
          {chatMode === 'group' && (
            <input
              placeholder="Enter group name"
              className="w-full border px-2 py-1 rounded"
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  const groupName = e.target.value.trim()
                  if (!groupName) return

                  const room = await service.createGroupRoom({
                    name: groupName,
                    creatorId: user.$id,
                  })

                  setShowNewChat(false)
                  setChatMode(null)
                  navigate(`/chat/${room.$id}`)
                }
              }}
            />
          )}
        </div>
      )}

      {/* Rooms List */}
      {rooms.length === 0 && (
        <p className="text-sm text-gray-500">No rooms yet</p>
      )}

      {rooms.map(room => (
        <div
          key={room.$id}
          onClick={() => navigate(`/chat/${room.$id}`)}
          className="p-2 cursor-pointer text-[#878686] bg-white text-2xl hover:bg-gray-300"
        >
          {/* 🔑 FIX IS HERE */}
          {room.isGroup
            ? room.name
            : (userMap[room.$id] ?? 'Loading…')}
        </div>
      ))} 
    </div>
  )
}

export default RoomList
