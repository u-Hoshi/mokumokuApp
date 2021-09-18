import { VFC } from 'react'
import { Calendar } from 'antd'
import { Moment } from 'moment'
import RoomCalendarSquare from 'components/orgnisms/RoomCalendarSquare'
import { RoomType } from 'types/room'

type Props = {
  rooms: RoomType[]
}

const RoomCalendar: VFC<Props> = (props) => {
  const { rooms } = props
  const getListData = (value: Moment, rooms: RoomType[]) => {
    // valueはカレンダーに表示される日数に渡され、毎回実行される(42日)
    let listData: any[] = []
    rooms.map((room: RoomType) => {
      if (value.year() === room.hostDay[0]) {
        if (value.month() === room.hostDay[1]) {
          if (value.date() === room.hostDay[2]) {
            listData = [...listData, { key: room.id, ...room }]
          }
        }
      }
    })
    return listData || []
  }

  const dateCellRender = (value: Moment) => {
    const listData = getListData(value, rooms)
    return listData.map((room: RoomType) => {
      return (
        <RoomCalendarSquare
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
  }

  const getMonthData = (value: Moment, rooms: RoomType[]) => {
    let listData: any[] = []
    rooms.map((room: RoomType) => {
      if (value.year() === room.hostDay[0]) {
        if (value.month() === room.hostDay[1]) {
          listData = [...listData, { key: room.id, ...room }]
        }
      }
    })
    return listData || []
  }

  const monthCellRender = (value: Moment) => {
    const listData = getMonthData(value, rooms)
    return listData.map((room: RoomType) => {
      return (
        <RoomCalendarSquare
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
  }

  return <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
}

export default RoomCalendar
