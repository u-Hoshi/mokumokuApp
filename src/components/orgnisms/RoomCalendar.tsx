import { VFC } from 'react'
import { Calendar } from 'antd'
import { Moment } from 'moment'
import RoomCalendarModal from 'components/molecules/RoomCalendarModal'

type room = {
  id: string
  AuthorId: string
  hostDay: number[]
  endTime: []
  meetType: string
  message: string
  startTime: []
}

const RoomCalendar: VFC<any> = (props) => {
  const { rooms } = props
  const getListData = (value: Moment, rooms: []) => {
    // valueはカレンダーに表示される日数に渡され、毎回実行される(目安35回)
    // TODO 型指定
    let listData
    rooms.map((room: room) => {
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

  const dateCellRender = (value: any) => {
    const listData = getListData(value, rooms)
    return listData.map((item: room) => {
      return (
        <RoomCalendarModal
          id={item.id}
          AuthorId={item.AuthorId}
          hostDay={item.hostDay}
          startTime={item.startTime}
          endTime={item.endTime}
          meetType={item.meetType}
          message={item.message}
        />
      )
    })
  }

  return <Calendar dateCellRender={dateCellRender} />
}

export default RoomCalendar
