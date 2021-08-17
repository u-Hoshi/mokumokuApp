import RoomCard from 'components/orgnisms/RoomCard'
import { db } from '../../firebase/index'
import { useEffect, useState, VFC } from 'react'
import { Row } from 'antd'
import RoomCalendar from 'components/orgnisms/RoomCalendar'

const RoomTable: VFC = () => {
  type room = {
    id: string
    AuthorId: string
    hostDay: []
    endTime: []
    meetType: string
    message: string
    startTime: []
  }
  // TODO anyを取り除く
  const [rooms, setRooms] = useState<any>([])

  // 全ルームの情報を取得取得
  useEffect(() => {
    db.collection('Group1')
      .orderBy('createdAt', 'desc')
      .onSnapshot((snapshot) => {
        const rooms = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          }
        })
        console.log(rooms)
        // ↑では[{}]だが↓では[object object]の形で代入される
        setRooms(rooms)
      })
  }, [])
  return (
    <>
      <Row gutter={[8, 40]}>
        {rooms ? (
          rooms.map((room: room) => {
            return (
              <RoomCard
                key={room.id}
                roomId={room.id}
                AuthorId={room.AuthorId}
                hostDay={room.hostDay}
                startTime={room.startTime}
                endTime={room.endTime}
                meetType={room.meetType}
                message={room.message}
              />
            )
          })
        ) : (
          <p>...loading</p>
        )}
      </Row>
      <RoomCalendar rooms={rooms} />
    </>
  )
}

export default RoomTable
