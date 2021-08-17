import RoomCard from 'components/orgnisms/RoomCard'
import { db } from '../../firebase/index'
import { useEffect, useState, VFC } from 'react'
import { Col, Row, Switch } from 'antd'
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

  const [isDisplay, setIsDisplay] = useState(false)

  const onChangeSwitch = () => {
    setIsDisplay(!isDisplay)
  }

  return (
    <>
      <Col offset={1} span={14} style={{ paddingBottom: '14px' }}>
        表示切り替え：
        <Switch size="default" checkedChildren="カレンダー" unCheckedChildren="カード" onChange={onChangeSwitch} />
      </Col>
      {isDisplay ? (
        <RoomCalendar rooms={rooms} />
      ) : (
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
      )}
    </>
  )
}

export default RoomTable
