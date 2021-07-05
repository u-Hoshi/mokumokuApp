import RoomCard from 'components/orgnisms/RoomCard'
import { db } from '../../firebase/index'
import { useEffect, useState, VFC } from 'react'
import Room from 'components/pages/Room'
import { Row } from 'antd'

const RoomTable: VFC = () => {
  type room = {
    id: string
    Author: string
    endtimeDT: []
    meettype: string
    message: string
    starttimeDT: []
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
      {/* <RoomCard /> */}
      <Row gutter={[8, 40]}>
        {allrooms ? (
          allrooms.map((room: room) => (
            <RoomCard
              key={room.id}
              Author={room.Author}
              startTimeDT={room.starttimeDT}
              endTimeDT={room.endtimeDT}
              meettype={room.meettype}
              message={room.message}
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
