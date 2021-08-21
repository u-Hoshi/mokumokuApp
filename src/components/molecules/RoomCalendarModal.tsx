import { Modal, Button } from 'antd'
import { VFC } from 'react'

type room = {
  id: string
  AuthorId: string
  // authorName: string
  hostDay: number[]
  endTime: number[]
  meetType: string
  message: string
  startTime: number[]
}

const RoomCalendarModal: VFC<room> = (props) => {
  const { hostDay, startTime, endTime, meetType, message } = props
  const info = () => {
    Modal.info({
      // TODO タイトルも決めれるようにする
      title: 'もくもく会',
      content: (
        <div>
          <h3>{`${hostDay[1] + 1}月${hostDay[2]}日`}</h3>
          {/* 作成者を記録するようにする */}
          {/* <h3>{`${roomInfo.authorName}`}</h3> */}
          <h3>{`${startTime[3]}時${startTime[4]}分から${endTime[3]}時${endTime[4]}分まで`}</h3>
          <h4>{meetType}</h4>
          <h4>{message}</h4>
        </div>
      ),
    })
  }
  return (
    <>
      <Button block size="small" style={{ borderColor: '#1890FF' }} onClick={info}>
        {/* TODO タイトルも決めれるようにする */}
        もくもく会
      </Button>
    </>
  )
}
export default RoomCalendarModal
