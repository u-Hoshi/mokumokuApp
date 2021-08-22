import { Modal, Button } from 'antd'
import { VFC } from 'react'
import { RoomType } from 'types/room'

const RoomCalendarModal: VFC<RoomType> = (props) => {
  const { hostDay, startTime, endTime, meetTitle, meetType, meetMessage } = props
  const info = () => {
    Modal.info({
      title: { meetTitle },
      content: (
        <div>
          <h3>{`${hostDay[1] + 1}月${hostDay[2]}日`}</h3>
          {/* 作成者を記録するようにする */}
          {/* <h3>{`${roomInfo.authorName}`}</h3> */}
          <h3>{`${startTime[3]}時${startTime[4]}分から${endTime[3]}時${endTime[4]}分まで`}</h3>
          <h4>{meetType}</h4>
          <h4>{meetMessage}</h4>
        </div>
      ),
    })
  }
  return (
    <>
      <Button block size="small" style={{ borderColor: '#1890FF' }} onClick={info}>
        {/* TODO タイトルも決めれるようにする */}
        {meetTitle}
      </Button>
    </>
  )
}
export default RoomCalendarModal
