import { Col, Row } from 'antd'
import RoomDetail from 'components/molecules/RoomDetail'
import HeaderLayout from 'components/themplates/HeaderLayout'
import RoomTable from 'components/themplates/RoomTable'
import { VFC, useContext } from 'react'
import { LoginUserContext } from 'components/providers/LoginUserProvider'

const Room: VFC = () => {
  // TODO ↓をRoomDetailの方に移植する
  const { loginUser, setLoginUser } = useContext(LoginUserContext)
  console.log('room')
  console.log(loginUser)
  return (
    <>
      <HeaderLayout />
      <Row>
        <Col span={16}>
          <RoomTable />
        </Col>
        <Col span={6} offset={1}>
          <RoomDetail user={loginUser} />
        </Col>
      </Row>
    </>
  )
}

export default Room
