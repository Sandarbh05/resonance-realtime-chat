import RoomList from './RoomList'
import ChatRoom from './ChatRoom'

function ChatLayout({ roomId }) {
  return (
    <div className="m-2 flex h-[84vh] border-b border-t">
      <div className=" h-full border-r border-l">
        <RoomList />
      </div>

      <div className="flex-1 h-full border-r">
        {roomId ? (
          <ChatRoom roomId={roomId} />
        ) : (
          <div className="h-full flex items-center justify-center text-white w-[50vw] text-5xl">
            Select a room to start <br /> chatting...
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatLayout