import RoomCard from 'components/orgnisms/RoomCard'
import { db } from '../../firebase/index'
import { useEffect, useState, VFC } from 'react'
import { Col, Row, Switch, Typography } from 'antd'
import RoomCalendar from 'components/orgnisms/RoomCalendar'
import moment from 'moment'

const { Text } = Typography

const RoomTable: VFC = () => {
  type room = {
    id: string
    AuthorId: string
    hostDay: number[]
    endTime: number[]
    meetTitle: string
    meetType: string
    meetMessage: string
    startTime: number[]
  }
  // TODO anyを取り除く
  const [rooms, setRooms] = useState<any>([])

  const nowTimeInt =
    moment().toArray()[0] * 100000000 +
    moment().toArray()[1] * 1000000 +
    moment().toArray()[2] * 10000 +
    moment().toArray()[3] * 100 +
    moment().toArray()[4]

  const [isDisplay, setIsDisplay] = useState(false)
  const onChangeDisplay = () => {
    setIsDisplay(!isDisplay)
  }

  const [cardSort, setCardSort] = useState(true)

  const onChangeSort = () => {
    setCardSort(!cardSort)
  }

  // 全ルームの情報を取得取得
  useEffect(() => {
    if (cardSort) {
      db.collection('Group1')
        .orderBy('startDayTimeInt', 'asc')
        .where('startDayTimeInt', '>', nowTimeInt)
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
    } else {
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
    }
  }, [cardSort])

  return (
    <>
      <Col offset={1} span={14} style={{ paddingBottom: '14px' }}>
        <Text>表示切り替え：</Text>
        <Switch
          style={{ display: 'inline' }}
          checkedChildren="カレンダー"
          unCheckedChildren="カード"
          onChange={onChangeDisplay}
        />
        {isDisplay || (
          <>
            <Text style={{ paddingLeft: '14px' }}>カードの並び順：</Text>
            <Switch
              defaultChecked
              checkedChildren="開催日に近い順"
              unCheckedChildren="作成日順"
              onChange={onChangeSort}
              style={{
                display: 'inline',
              }}
            />
          </>
        )}
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
                  roomAuthorId={room.AuthorId}
                  roomHostDay={room.hostDay}
                  roomStartTime={room.startTime}
                  roomEndTime={room.endTime}
                  roomMeetTitle={room.meetTitle}
                  roomMeetType={room.meetType}
                  roomMeetMessage={room.meetMessage}
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
