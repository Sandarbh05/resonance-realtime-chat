import RoomList from './RoomList'
import ChatRoom from './ChatRoom'
import { useState } from 'react'

function ChatLayout({ roomId }) {
  const [showSidebar, setShowSidebar] = useState(true)

  return (
    <div className="flex h-screen w-full min-h-0 overflow-hidden ">

      {/* Sidebar */}
      <div
        className={`
          bg-[#2b2f33]
          w-64
          h-full
          border-r
          min-h-0
          flex
          flex-col
          ${roomId ? "hidden md:flex" : "flex"}
        `}
      >
        <RoomList />
      </div>

      {/* Chat */}
      <div className="flex-1 h-full overflow-hidden flex flex-col">

        {roomId ? (
          <ChatRoom roomId={roomId} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-white text-xl sm:text-3xl md:text-4xl text-center px-4">
            Select or form a room to start chatting.
          </div>
        )}

      </div>
    </div>
  )
}

export default ChatLayout
