import { Col, Row } from 'antd'
import RoomDetail from 'components/molecules/RoomDetail'
import HeaderLayout from 'components/themplates/HeaderLayout'
import RoomTable from 'components/themplates/RoomTable'
import { VFC } from 'react'

const Room: VFC = () => {
  return (
    <>
      <HeaderLayout />
      <Row>
        <Col span={16}>
          <RoomTable />
        </Col>
        {/* <Row align="middle"> */}
        <Col span={6} offset={1}>
          <RoomDetail />
        </Col>
        {/* </Row> */}
      </Row>
    </>
  )
}

export default Room
