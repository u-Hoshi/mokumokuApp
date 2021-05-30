import { Col, Row } from 'antd'
import RoomDetail from 'components/molecules/RoomDetail'
import RoomTable from 'components/themplates/RoomTable'
import { VFC } from 'react'

const Room: VFC = () => {
  return (
    <>
      <Row>
        <Col span={17}>
          <RoomTable />
        </Col>
        <Col span={6} offset={1}>
          <RoomDetail />
        </Col>
      </Row>
    </>
  )
}

export default Room
