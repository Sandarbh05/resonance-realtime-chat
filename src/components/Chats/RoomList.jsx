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
<div className="flex flex-col h-full min-h-0 text-white px-4 py-4">

  {/* User ID */}
  {user && (
    <div className="mb-4 p-2 border border-white rounded-md text-sm flex items-center justify-between ">
      <div className="truncate">
        <span className="font-semibold">User ID:</span>{" "}
        <span className="select-all">{user.$id}</span>
      </div>

      <button
        className="ml-2 text-xs bg-white text-black rounded px-2 py-1 hover:bg-gray-200"
        onClick={() => navigator.clipboard.writeText(user.$id)}
      >
        Copy
      </button>
    </div>
  )}

  {/* Header */}
  <h2 className="font-semibold mb-3 text-2xl">
    Rooms
  </h2>

  {/* New Chat */}
  <button
    onClick={() => {
      setShowNewChat(prev => !prev)
      setChatMode(null)
    }}
    className="w-full mb-3 px-3 py-2 border border-white rounded hover:bg-gray-700 transition"
  >
    + New Chat
  </button>

  {/* Create Chat Panel */}
  {showNewChat && (
    <div className="mb-4 space-y-2 border border-white rounded p-2">

      {!chatMode && (
        <>
          <button
            onClick={() => setChatMode('dm')}
            className="w-full py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Direct Message
          </button>

          <button
            onClick={() => setChatMode('group')}
            className="w-full py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            Create Group
          </button>
        </>
      )}

      {chatMode === 'dm' && (
        <input
          placeholder="Enter userId"
          className="w-full px-3 py-2 rounded text-black"
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

      {chatMode === 'group' && (
        <input
          placeholder="Enter group name"
          className="w-full px-3 py-2 rounded text-black"
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

  {/* Scrollable Rooms List */}
  <div className=" flex-1 overflow-y-auto space-y-2 pr-1 min-h-0" style={{
    overflow: screenY
  }}> 
    {rooms.length === 0 && (
      <p className="text-sm text-gray-400">
        No rooms yet
      </p>
    )}

    {rooms.map(room => (
      

      <div
        key={room.$id}
        onClick={() => navigate(`/chat/${room.$id}`)}
        className="p-3 rounded bg-white text-black cursor-pointer hover:bg-gray-200 transition text-sm md:text-base" 
        >
        {room.isGroup
          ? room.name
          : (userMap[room.$id] ?? 'Loading…')}
      </div>

    ))}
  </div>

</div>

  )
}

export default RoomList
