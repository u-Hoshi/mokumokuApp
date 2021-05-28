import { Col, Row } from 'antd'
import RoomDetail from 'components/molecules/RoomDetail'
import { VFC } from 'react'

const DemoBox = (props: any) => <p className={`height-${props.value}`}>{props.children}</p>

const Room: VFC = () => {
  return (
    <>
      <Row align="bottom" style={{ alignItems: 'bottom' }} justify="end" gutter={10}>
        <Col>
          <RoomDetail />
        </Col>
      </Row>
    </>
  )
}

export default Room
