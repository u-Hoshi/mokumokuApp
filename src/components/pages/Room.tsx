import { Col, Row } from 'antd'
import HeaderLayout from 'components/themplates/HeaderLayout'
import RoomTable from 'components/themplates/RoomTable'
import { VFC } from 'react'
import AddRoom from 'components/orgnisms/AddRoom'
import styles from '../styles/Room.module.css'
import AddRoomFormSp from 'components/themplates/AddRoomFormSp'

const Room: VFC = () => {
  return (
    <>
      <HeaderLayout />
      <Row style={{ margin: '0 15px' }}>
        <Col className={styles.addRoomSp}>
          <AddRoomFormSp />
        </Col>
        <Col className={styles.roomTable}>
          <RoomTable />
        </Col>
        <Col span={6} className={styles.addRoomPc}>
          <AddRoom />
        </Col>
      </Row>
    </>
  )
}

export default Room
