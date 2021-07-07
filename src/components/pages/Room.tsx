import { Col, Row } from 'antd'
import RoomDetail from 'components/molecules/RoomDetail'
import HeaderLayout from 'components/themplates/HeaderLayout'
import RoomTable from 'components/themplates/RoomTable'
import { auth } from '../../firebase/index'
import { VFC, useContext } from 'react'
import { LoginUserContext } from 'components/providers/LoginUserProvider'

const Room: VFC = () => {
  const { loginUser, setLoginUser } = useContext(LoginUserContext)
  return (
    <>
      <HeaderLayout />
      <Row>
        <Col span={16}>
          <RoomTable />
        </Col>
        <Col span={6} offset={1}>
          <RoomDetail user={loginUser} />
          {/* 仮ログアウトボタン */}
          <button onClick={() => auth.signOut()}>Logout(仮)</button>
        </Col>
      </Row>
    </>
  )
}

export default Room
