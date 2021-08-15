import RoomCard from 'components/orgnisms/RoomCard'
import { db } from '../../firebase/index'
import { useEffect, useState, VFC } from 'react'
import Room from 'components/pages/Room'
import { Row } from 'antd'

const RoomTable: VFC = () => {
  type room = {
    id: string
    AuthorId: string
    hostDay: string
    endTime: []
    meetType: string
    message: string
    startTime: []
  }
  // TODO anyを取り除く
  const [allrooms, setRooms] = useState<any>([])

  // 全ルームの情報を取得取得
  useEffect(() => {
    db.collection('Group1').onSnapshot((snapshot) => {
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
        {allrooms ? (
          allrooms.map((room: room) => (
            <RoomCard
              key={room.id}
              AuthorId={room.AuthorId}
              hostDay={room.hostDay}
              startTime={room.startTime}
              endTime={room.endTime}
              meetType={room.meetType}
              message={room.message}
              roomId={room.id}
            />
          ))
        ) : (
          <p>...loading</p>
        )}
      </Row>
    </>
  )
}

export default RoomTable
