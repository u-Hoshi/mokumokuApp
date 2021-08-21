import { Col, Row } from 'antd'
import HeaderLayout from 'components/themplates/HeaderLayout'
import RoomTable from 'components/themplates/RoomTable'
import { VFC, useContext } from 'react'
import { LoginUserContext } from 'components/providers/LoginUserProvider'
import AddRoom from 'components/orgnisms/AddRoom'

const Room: VFC = () => {
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
          <AddRoom user={loginUser} />
        </Col>
      </Row>
    </>
  )
}

export default Room
