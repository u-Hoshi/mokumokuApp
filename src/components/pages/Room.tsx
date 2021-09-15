import { Col, Row } from 'antd'
import HeaderLayout from 'components/themplates/HeaderLayout'
import RoomTable from 'components/themplates/RoomTable'
import { VFC, useContext } from 'react'
import { LoginUserContext } from 'components/providers/LoginUserProvider'
import AddRoom from 'components/orgnisms/AddRoom'
import { UserType } from 'types/user'
import styles from './Room.module.css'
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
