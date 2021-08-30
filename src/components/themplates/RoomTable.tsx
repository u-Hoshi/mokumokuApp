import RoomCard from 'components/orgnisms/RoomCard'
import { db } from '../../firebase/index'
import { useEffect, useState, VFC } from 'react'
import { Col, Radio, RadioChangeEvent, Row, Select, Switch, Typography } from 'antd'
import RoomCalendar from 'components/themplates/RoomCalendar'
import moment from 'moment'
import { RoomType } from '../../types/room'
import { Option } from 'antd/lib/mentions'

const { Text } = Typography

const RoomTable: VFC = () => {
  const [rooms, setRooms] = useState<Array<RoomType>>([])

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
  const [cardSortType, setCardSortType] = useState<string[]>(['フロントエンド', 'バックエンド', 'インフラ'])
  const onChangeType = (value: string) => {
    const initialcardSortType = ['フロントエンド', 'バックエンド', 'インフラ']
    if (value === '全て') {
      setCardSortType(initialcardSortType.filter((cardSortType: string) => cardSortType !== value))
    } else {
      setCardSortType(initialcardSortType.filter((cardSortType: string) => cardSortType === value))
    }
  }
  const onChangeSort = (e: RadioChangeEvent) => {
    setCardSort(!e)
  }
  console.log(cardSortType)
  // 全ルームの情報を取得取得
  useEffect(() => {
    if (cardSort) {
      db.collection('Group1')
        .orderBy('startDayTimeInt', 'asc')
        .where('startDayTimeInt', '>', nowTimeInt)
        .where('meetType', 'in', cardSortType)
        .onSnapshot((snapshot) => {
          const rooms = snapshot.docs.map((doc) => {
            const data = doc.data()
            return {
              id: doc.id,
              meetTitle: data.meetTitle,
              Author: data.Author,
              AuthorId: data.AuthorId,
              hostDay: data.hostDay,
              startDayTimeInt: data.startDayTimeInt,
              startTime: data.startTime,
              endTime: data.endTime,
              meetType: data.meetType,
              meetMessage: data.meetMessage,
            }
          })
          console.log(rooms)
          // ↑では[{}]だが↓では[object object]の形で代入される
          setRooms(rooms)
        })
    } else {
      db.collection('Group1')
        .orderBy('createdAt', 'desc')
        .where('meetType', 'in', cardSortType)
        .onSnapshot((snapshot) => {
          const rooms = snapshot.docs.map((doc) => {
            const data = doc.data()
            return {
              id: doc.id,
              meetTitle: data.meetTitle,
              Author: data.Author,
              AuthorId: data.AuthorId,
              hostDay: data.hostDay,
              startDayTimeInt: data.startDayTimeInt,
              startTime: data.startTime,
              endTime: data.endTime,
              meetType: data.meetType,
              meetMessage: data.meetMessage,
            }
          })
          console.log(rooms)
          // ↑では[{}]だが↓では[object object]の形で代入される
          setRooms(rooms)
        })
    }
  }, [cardSort, cardSortType])

  return (
    <>
      <Col offset={1} style={{ paddingBottom: '14px', maxWidth: '564px' }}>
        <Text>表示の切り替え：</Text>
        <Radio.Group onChange={onChangeDisplay} defaultValue={1}>
          <Radio value={1}>カード</Radio>
          <Radio value={2}>カレンダー</Radio>
        </Radio.Group>
        {isDisplay || (
          <>
            <Text style={{ paddingLeft: '8px' }}>表示切り替え：</Text>
            <Select style={{ width: 150 }} onChange={(e) => onChangeType(e)} defaultValue={'全て'}>
              <Option value="全て">全て</Option>
              <Option value="フロントエンド">フロントエンド</Option>
              <Option value="バックエンド">バックエンド</Option>
              <Option value="インフラ">インフラ</Option>
            </Select>
            <Text>カードの並び順：</Text>
            <Radio.Group onChange={(e) => onChangeSort(e)} defaultValue={1}>
              <Radio value={1}>開催日に近い順</Radio>
              <Radio value={2}>作成日順</Radio>
            </Radio.Group>
          </>
        )}
      </Col>
      {isDisplay ? (
        <RoomCalendar rooms={rooms} />
      ) : (
        <Row gutter={[8, 40]}>
          {rooms ? (
            rooms.map((room: RoomType) => {
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
