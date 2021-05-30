import RoomCard from 'components/orgnisms/RoomCard'
import { db } from '../../firebase/index'
import { useEffect, useState, VFC } from 'react'
import Room from 'components/pages/Room'
import { Row } from 'antd'

const RoomTable: VFC = () => {
  type room = {
    endtimeDT: []
    meettype: string
    message: string
    starttimeDT: []
  }

  const [allrooms, setRooms] = useState<any>([])

  useEffect(() => {
    db.collection('Group1').onSnapshot((snapshot) => {
      const rooms = snapshot.docs.map((doc) => {
        return {
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
      ,
    </>
  )
}

export default RoomTable
