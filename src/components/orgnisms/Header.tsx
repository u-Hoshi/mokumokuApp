import { Row, Anchor, Col, Button } from 'antd'
import { Typography } from 'antd'
const { Title, Text } = Typography
import { VFC, useContext } from 'react'
import { useHistory } from 'react-router'
import { auth } from '../../firebase/index'
import { LoginUserContext } from 'components/providers/LoginUserProvider'

const Header: VFC = () => {
  const { loginUser } = useContext(LoginUserContext)
  const history = useHistory()

  const onClickUserSetting = () => {
    history.push(`/usersetting/${loginUser.uid}`)
  }

  return (
    <>
      <Row
        align="middle"
        style={{ backgroundColor: '#000224', color: 'white', padding: '20px 15px', marginBottom: '15px' }}
      >
        {/* <Col> */}
        <Title level={3} style={{ color: 'white', textAlign: 'center', marginBottom: '0', paddingRight: '10px' }}>
          もくもく会アプリ
        </Title>
        {/* </Col> */}
        {/* <Col> */}
        <Text onClick={onClickUserSetting} style={{ color: 'white', textAlign: 'center', cursor: 'pointer' }}>
          ユーザ設定
        </Text>
        {/* </Col> */}
        {/* <Col offset={23}> */}
        <Button type="link" onClick={() => auth.signOut()} danger>
          ログアウト
        </Button>
        {/* </Col> */}
      </Row>
    </>
  )
}

export default Header
