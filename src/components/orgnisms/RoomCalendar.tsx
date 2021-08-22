import { VFC } from 'react'
import { Calendar } from 'antd'
import { Moment } from 'moment'
import RoomCalendarModal from 'components/molecules/RoomCalendarModal'
import { RoomType } from 'types/room'

type Props = {
  rooms: RoomType[]
}

const RoomCalendar: VFC<Props> = (props) => {
  const { rooms } = props
  console.log(rooms)
  const getListData = (value: Moment, rooms: RoomType[]) => {
    // valueはカレンダーに表示される日数に渡され、毎回実行される(42日)
    let listData
    rooms.map((room: RoomType) => {
      if (value.year() === room.hostDay[0]) {
        if (value.month() === room.hostDay[1]) {
          if (value.date() === room.hostDay[2]) {
            listData = [{ ...room }]
          }
        }
      }
    })
    return listData || []
  }

  const dateCellRender = (value: Moment) => {
    const listData = getListData(value, rooms)
    return listData.map((item: RoomType) => {
      return (
        <RoomCalendarModal
          id={item.id}
          AuthorId={item.AuthorId}
          hostDay={item.hostDay}
          startTime={item.startTime}
          endTime={item.endTime}
          meetTitle={item.meetTitle}
          meetType={item.meetType}
          meetMessage={item.meetMessage}
        />
      )
    })
  }

  return <Calendar dateCellRender={dateCellRender} />
}

export default RoomCalendar
